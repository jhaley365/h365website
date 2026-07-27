# Employee Birthdays

Internal tool that tracks employee birthdays and automatically:

1. Sends a "Happy Birthday" announcement email to a company address at 8:00 AM
   (America/New_York by default) on each employee's birthday, with a randomly
   chosen celebratory image.
2. Sends a daily management summary email listing every employee's birth date
   and whether today's announcement (if applicable) was sent.

It also includes a simple, password-protected management UI for adding,
editing, and deleting employees (first name, last name, email, birth date).

## Tech stack

Plain Node.js + Express + EJS views, SQLite (via `better-sqlite3`) for
storage, `node-cron` for scheduling, and `nodemailer` for outbound email. No
build step, no external services required beyond an SMTP account. Designed to
run as a single always-on process (VPS, Docker, Render, Railway, Fly.io,
etc.) — the scheduler runs in-process, so nothing external needs to trigger it.

## Setup

```bash
cd employee-birthdays
npm install
cp .env.example .env
```

Edit `.env`:

- `SESSION_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` — run `npm run hash-password`, enter
  a password, and paste the printed `ADMIN_PASSWORD_HASH` line into `.env`.
- `SMTP_*` and `MAIL_FROM` — your outbound mail provider's SMTP credentials
  (Office 365, Google Workspace, Amazon SES SMTP, SendGrid SMTP, etc.).
- `BIRTHDAY_ANNOUNCEMENT_TO` — the company address/distribution list that
  should receive each birthday announcement.
- `MANAGEMENT_SUMMARY_TO` — who should receive the daily roster summary
  (comma-separate multiple addresses).
- `TIMEZONE` / `SEND_HOUR` / `SEND_MINUTE` — when the daily job runs. Defaults
  to 8:00 AM `America/New_York`, which automatically accounts for EST/EDT.

Then start it:

```bash
npm start
```

Visit `http://localhost:3000`, log in with the admin credentials, and add
employees under **Employees**.

## How the daily job works

- Runs once per day at the configured time, evaluated in the configured
  timezone (`src/services/scheduler.js`).
- For every employee whose birth month/day matches today, sends the birthday
  announcement (`BIRTHDAY_ANNOUNCEMENT_TO`) with one of the images in
  `public/images/birthday/` chosen at random and embedded inline.
- Employees born on Feb 29 are celebrated on Feb 28 in non-leap years.
- Records every send attempt in the database so an employee is never
  announced twice in the same year, even if the server restarts and the job
  re-evaluates the same day.
- Always sends the management summary afterwards (also idempotent — once per
  calendar day), listing every employee's birth date and, for anyone whose
  birthday is today, whether the announcement actually went out.

To test the whole flow on demand without waiting for 8 AM:

```bash
npm run run-daily-job
```

This is safe to re-run — anyone already announced this year, or a summary
already sent today, will be skipped and reported as `already-sent`.

## Birthday images

`public/images/birthday/*.png` are original graphics generated from the SVG
sources in `public/images/birthday/src/`. To add more variety, drop a new SVG
into `src/` and regenerate:

```bash
npm run generate-images
```

(This uses `sharp`, a dev dependency, purely as a one-time build step — it is
not required at runtime.) PNGs are used instead of SVGs because Outlook's
desktop rendering engine does not support inline SVG images in HTML email.

## Deployment notes

- This is a single long-running Node process — deploy it anywhere that keeps
  a process alive (systemd service, Docker container, Render/Railway/Fly.io,
  etc.). Don't deploy it as short-lived serverless functions, since the
  in-process scheduler needs to stay running to fire at 8 AM.
- The SQLite database file lives at `DB_PATH` (default `./data/birthdays.db`).
  Make sure that path is on persistent storage that survives deploys/restarts.
- Set `NODE_ENV=production` so session cookies are marked `secure` (requires
  serving over HTTPS, e.g. behind a reverse proxy/load balancer that
  terminates TLS).
