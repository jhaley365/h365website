# Deploying to an AWS EC2 instance

This is a runbook for taking a fresh EC2 instance to a running, internet
reachable Employee Birthdays app. It assumes Ubuntu 22.04/24.04. (On Amazon
Linux, swap `apt-get` for `dnf` and the package names differ slightly —
everything else is the same.)

## 1. Launch / prep the instance

- Instance size: this app is tiny — a `t3.micro` or `t4g.micro` is plenty.
- Security group inbound rules:
  - **22 (SSH)** — restrict to your IP, not `0.0.0.0/0`.
  - **80 (HTTP)** and **443 (HTTPS)** — open to the internet (needed for the
    login page and for Let's Encrypt's certificate challenge).
  - Do **not** open port 3000 (the app's internal port) to the internet —
    nginx is the only thing that should reach it, over localhost.
- DNS: point an A record (e.g. `birthdays.haley365.com`) at the instance's
  public IP/Elastic IP before requesting a TLS certificate in step 4.

## 2. Give the instance read-only access to the repo (deploy key)

Since `h365website` is private, the instance needs its own credential to
`git clone`/`git pull`. Use a **deploy key** — an SSH key pair scoped to just
this one repo, read-only, not tied to anyone's personal GitHub account. That
way if the instance is ever compromised, the blast radius is "can read this
one repo," not "can push anywhere jeff@haley365.com can."

On the instance:

```bash
sudo ssh-keygen -t ed25519 -C "employee-birthdays-ec2" -f /root/.ssh/h365website_deploy -N ""
sudo cat /root/.ssh/h365website_deploy.pub
```

Copy that public key. In GitHub: **h365website repo → Settings → Deploy
keys → Add deploy key**. Paste it in, leave **"Allow write access" unchecked**
(read-only — the instance only ever needs to pull), and save.

Then tell git on the instance to use that key for this repo:

```bash
sudo tee -a /root/.ssh/config >/dev/null <<'EOF'
Host github-h365website
  HostName github.com
  User git
  IdentityFile /root/.ssh/h365website_deploy
  IdentitiesOnly yes
EOF
sudo chmod 600 /root/.ssh/config
```

## 3. Clone the repo and run the setup script

```bash
sudo mkdir -p /opt/h365website
sudo git clone github-h365website:jhaley365/h365website.git /opt/h365website
cd /opt/h365website
sudo git checkout claude/employee-birthday-announcements-4ym3ew
```

(Once this branch is merged to your default branch, `git checkout main`
instead — see step 6.)

The actual app lives in the `employee-birthdays/` subfolder of that
checkout:

```bash
cd /opt/h365website/employee-birthdays
sudo bash deploy/setup.sh
```

This installs Node.js 22, creates a dedicated `birthdays` system user (no
login shell — the app never needs one), installs production dependencies,
and registers the systemd service (but does not start it yet).

Then configure it:

```bash
sudo -u birthdays nano /opt/h365website/employee-birthdays/.env
```

Fill in at minimum: `SESSION_SECRET`, `SMTP_*`, `MAIL_FROM`,
`BIRTHDAY_ANNOUNCEMENT_TO`, `MANAGEMENT_SUMMARY_TO`. Generate the admin
password hash and paste it in as `ADMIN_PASSWORD_HASH`:

```bash
cd /opt/h365website/employee-birthdays && sudo -u birthdays npm run hash-password
```

Start the app:

```bash
sudo systemctl start employee-birthdays
sudo systemctl status employee-birthdays
sudo journalctl -u employee-birthdays -f   # tail logs
```

At this point `curl http://127.0.0.1:3000` from on the instance should return
the login page's HTML.

## 4. Put nginx + TLS in front of it

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/employee-birthdays
sudo sed -i 's/birthdays.haley365.com/YOUR_REAL_HOSTNAME/' \
  /etc/nginx/sites-available/employee-birthdays
sudo ln -s /etc/nginx/sites-available/employee-birthdays /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d YOUR_REAL_HOSTNAME
```

Certbot edits the nginx config to add the HTTPS server block and sets up
auto-renewal. Visit `https://YOUR_REAL_HOSTNAME` and confirm the login page
loads over HTTPS.

## 5. Verify the whole flow

- Log in with the admin credentials, add a test employee with today's date
  as their birth date.
- Run the job on demand instead of waiting for 8 AM:
  ```bash
  cd /opt/h365website/employee-birthdays && sudo -u birthdays npm run run-daily-job
  ```
  Check that both the announcement and the management summary land in the
  right inboxes, then delete the test employee.

## 6. Updating the app later

Because step 3 set up a real, persistent git checkout (not a one-off copy),
future updates are just a pull. `deploy/update.sh` wraps the whole sequence:

```bash
cd /opt/h365website/employee-birthdays
sudo bash deploy/update.sh
```

This fetches the branch currently checked out, hard-resets the working tree
to match `origin` (safe here — `.env` and `data/` are gitignored/untracked,
so they're untouched; there should never be uncommitted local edits on a
deploy checkout), reinstalls dependencies, fixes file ownership, and restarts
the service.

To switch which branch is tracked (e.g. once this work merges to `main`),
pass it explicitly one time:

```bash
sudo bash deploy/update.sh main
```

After that, plain `sudo bash deploy/update.sh` keeps pulling `main`.

## Backups

The only state that matters is
`/opt/h365website/employee-birthdays/data/birthdays.db`. Snapshot the EBS
volume periodically, or just cron a copy of that file somewhere durable
(e.g. S3) — it's a single small SQLite file.
