#!/usr/bin/env bash
# One-time (but safe to re-run) setup for a fresh Ubuntu EC2 instance.
#
# Usage: run this AS ROOT (or via sudo) from inside the app checkout, e.g.:
#   cd /opt/h365website/employee-birthdays   # (or wherever you cloned it)
#   sudo bash deploy/setup.sh
#
# It installs Node.js, creates a dedicated low-privilege system user, installs
# dependencies, and wires up the systemd service. It does NOT start the app
# on its own the first time — you must create .env first (see README.md).
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVICE_USER="birthdays"
NODE_MAJOR=22

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root (e.g. sudo bash deploy/setup.sh)." >&2
  exit 1
fi

echo "==> App directory: $APP_DIR"

# --- Node.js ---
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/^v//' | cut -d. -f1)" -lt "$NODE_MAJOR" ]; then
  echo "==> Installing Node.js ${NODE_MAJOR}.x"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
else
  echo "==> Node.js already installed: $(node -v)"
fi

# --- Dedicated system user (no login shell, no home directory writes needed) ---
if ! id "$SERVICE_USER" >/dev/null 2>&1; then
  echo "==> Creating system user '$SERVICE_USER'"
  useradd --system --home-dir "$APP_DIR" --shell /usr/sbin/nologin "$SERVICE_USER"
else
  echo "==> User '$SERVICE_USER' already exists"
fi

# --- App directory ownership + data dir ---
mkdir -p "$APP_DIR/data"
chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"

# --- .env ---
if [ ! -f "$APP_DIR/.env" ]; then
  echo "==> Creating .env from .env.example (EDIT THIS BEFORE STARTING THE SERVICE)"
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  chown "$SERVICE_USER:$SERVICE_USER" "$APP_DIR/.env"
fi
chmod 600 "$APP_DIR/.env"

# --- Dependencies (production only, no dev deps like sharp) ---
echo "==> Installing production dependencies"
cd "$APP_DIR"
sudo -u "$SERVICE_USER" npm ci --omit=dev

# --- systemd service ---
echo "==> Installing systemd service"
NODE_BIN="$(command -v node)"
sed -e "s|/usr/bin/node|$NODE_BIN|" \
    -e "s|/opt/employee-birthdays|$APP_DIR|g" \
    "$APP_DIR/deploy/employee-birthdays.service" \
    > /etc/systemd/system/employee-birthdays.service
echo "    Using node binary: $NODE_BIN"
echo "    App directory: $APP_DIR"
systemctl daemon-reload
systemctl enable employee-birthdays

cat <<EOF

==> Setup complete.

Next steps:
  1. Edit $APP_DIR/.env with real SMTP credentials, recipient addresses, and
     SESSION_SECRET (see README.md).
  2. Generate the admin password hash:
       cd $APP_DIR && sudo -u $SERVICE_USER npm run hash-password
     then paste the result into .env as ADMIN_PASSWORD_HASH.
  3. Start the app:
       systemctl start employee-birthdays
       systemctl status employee-birthdays
       journalctl -u employee-birthdays -f
EOF
