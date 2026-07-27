#!/usr/bin/env bash
# Pulls the latest code for a branch already checked out on this instance,
# reinstalls dependencies, and restarts the service. Safe to re-run.
#
# Usage (as root, from inside the employee-birthdays checkout):
#   sudo bash deploy/update.sh            # re-pull whatever branch is checked out
#   sudo bash deploy/update.sh main       # switch to (and thereafter track) main
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$(git -C "$APP_DIR" rev-parse --show-toplevel)"
SERVICE_USER="birthdays"

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root (e.g. sudo bash deploy/update.sh)." >&2
  exit 1
fi

BRANCH="${1:-$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD)}"

echo "==> Repo: $REPO_DIR"
echo "==> Branch: $BRANCH"

git -C "$REPO_DIR" fetch origin "$BRANCH"
git -C "$REPO_DIR" checkout "$BRANCH"
# Hard reset (not just pull/merge) so this checkout always exactly matches
# origin. Only safe because .env and data/ are gitignored/untracked, and a
# deploy checkout should never carry local commits or edits of its own.
git -C "$REPO_DIR" reset --hard "origin/$BRANCH"

echo "==> Restoring file ownership"
chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"

echo "==> Installing dependencies"
sudo -u "$SERVICE_USER" npm --prefix "$APP_DIR" ci --omit=dev

echo "==> Restarting service"
systemctl restart employee-birthdays
systemctl status employee-birthdays --no-pager
