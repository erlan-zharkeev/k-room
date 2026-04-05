#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.production}"
CERTS_DIR="${CERTS_DIR:-$ROOT_DIR/deploy-scripts/certs}"

if [ ! -f "$ENV_FILE" ]; then
  echo "[cert-sync] Env file not found: $ENV_FILE" >&2
  exit 1
fi

APP_HOST="$(grep '^APP_HOST=' "$ENV_FILE" | head -n 1 | cut -d '=' -f 2- | sed "s/^'//; s/'$//; s/^\"//; s/\"$//")"

if [ -z "$APP_HOST" ]; then
  echo "[cert-sync] APP_HOST is missing in $ENV_FILE" >&2
  exit 1
fi

CERT_DOMAIN="${CERT_DOMAIN:-$(printf '%s' "$APP_HOST" | sed -E 's#^[a-z]+://([^/]+).*$#\1#')}"
SOURCE_DIR="/etc/letsencrypt/live/$CERT_DOMAIN"

if [ ! -r "$SOURCE_DIR/fullchain.pem" ] || [ ! -r "$SOURCE_DIR/privkey.pem" ]; then
  echo "[cert-sync] Certificate files are not readable in $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$CERTS_DIR"
cp "$SOURCE_DIR/fullchain.pem" "$CERTS_DIR/fullchain.pem"
cp "$SOURCE_DIR/privkey.pem" "$CERTS_DIR/privkey.pem"

if command -v stat >/dev/null 2>&1; then
  OWNER_GROUP="$(stat -c '%u:%g' "$ROOT_DIR" 2>/dev/null || true)"
  if [ -n "${OWNER_GROUP:-}" ]; then
    chown "$OWNER_GROUP" "$CERTS_DIR/fullchain.pem" "$CERTS_DIR/privkey.pem"
  fi
fi

chmod 644 "$CERTS_DIR/fullchain.pem"
chmod 600 "$CERTS_DIR/privkey.pem"

echo "[cert-sync] Certificates synced for $CERT_DOMAIN"
