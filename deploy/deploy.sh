#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/compose.prod.yml}"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.production}"
RUNTIME_ENV_FILE="${RUNTIME_ENV_FILE:-$ROOT_DIR/.env.runtime}"
MERGED_ENV_FILE="$ROOT_DIR/.env.deploy"

require_env() {
  var_name="$1"
  eval "var_value=\${$var_name:-}"

  if [ -z "$var_value" ]; then
    echo "[deploy] Missing required env: $var_name" >&2
    exit 1
  fi
}

require_env DOCKERHUB_USERNAME
require_env DOCKERHUB_TOKEN

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "[deploy] Compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "[deploy] Env file not found: $ENV_FILE" >&2
  exit 1
fi

if [ ! -f "$RUNTIME_ENV_FILE" ]; then
  echo "[deploy] Runtime env file not found: $RUNTIME_ENV_FILE" >&2
  exit 1
fi

mkdir -p "$ROOT_DIR/deploy/certs"

cat "$ENV_FILE" "$RUNTIME_ENV_FILE" > "$MERGED_ENV_FILE"
trap 'rm -f "$MERGED_ENV_FILE"' EXIT

APP_HOST="$(grep '^APP_HOST=' "$ENV_FILE" | head -n 1 | cut -d '=' -f 2- | sed "s/^'//; s/'$//; s/^\"//; s/\"$//")"
CERT_DOMAIN="$(printf '%s' "$APP_HOST" | sed -E 's#^[a-z]+://([^/]+).*$#\1#')"

if [ -r "/etc/letsencrypt/live/$CERT_DOMAIN/fullchain.pem" ]; then
  sh "$ROOT_DIR/deploy/sync-certs.sh"
fi

echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" pull
docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans
