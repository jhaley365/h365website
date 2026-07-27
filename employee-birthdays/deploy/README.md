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

## 2. Get the code onto the instance

```bash
sudo mkdir -p /opt/employee-birthdays
sudo chown $(whoami) /opt/employee-birthdays
git clone --branch claude/employee-birthday-announcements-4ym3ew \
  https://github.com/jhaley365/h365website.git /tmp/h365website
cp -r /tmp/h365website/employee-birthdays/. /opt/employee-birthdays/
rm -rf /tmp/h365website
```

(Or `scp`/`rsync` the `employee-birthdays/` folder over if you'd rather not
put a git checkout on the box. Once this is merged to your default branch,
swap `--branch ...` for a normal clone of that branch.)

## 3. Run the setup script

```bash
cd /opt/employee-birthdays
sudo bash deploy/setup.sh
```

This installs Node.js 22, creates a dedicated `birthdays` system user (no
login shell — the app never needs one), installs production dependencies,
and registers the systemd service (but does not start it yet).

Then configure it:

```bash
sudo -u birthdays nano /opt/employee-birthdays/.env
```

Fill in at minimum: `SESSION_SECRET`, `SMTP_*`, `MAIL_FROM`,
`BIRTHDAY_ANNOUNCEMENT_TO`, `MANAGEMENT_SUMMARY_TO`. Generate the admin
password hash and paste it in as `ADMIN_PASSWORD_HASH`:

```bash
cd /opt/employee-birthdays && sudo -u birthdays npm run hash-password
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
  cd /opt/employee-birthdays && sudo -u birthdays npm run run-daily-job
  ```
  Check that both the announcement and the management summary land in the
  right inboxes, then delete the test employee.

## Updating the app later

```bash
cd /tmp && git clone --branch <branch> https://github.com/jhaley365/h365website.git
sudo systemctl stop employee-birthdays
rsync -a --exclude .env --exclude data --exclude node_modules \
  /tmp/h365website/employee-birthdays/ /opt/employee-birthdays/
cd /opt/employee-birthdays && sudo -u birthdays npm ci --omit=dev
sudo systemctl start employee-birthdays
rm -rf /tmp/h365website
```

`.env` and `data/` (the SQLite database) are excluded so redeploys never
touch your configuration or employee records.

## Backups

The only state that matters is `/opt/employee-birthdays/data/birthdays.db`.
Snapshot the EBS volume periodically, or just cron a copy of that file
somewhere durable (e.g. S3) — it's a single small SQLite file.
