#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/compose.prod.yml}"
SHARED_ENV_FILE="${SHARED_ENV_FILE:-$ROOT_DIR/.env.shared}"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.production}"
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
require_env MONGO_ADMIN_PASSWORD
require_env RESEND_API_KEY
require_env ADMIN_PASSWORD
require_env ACCESS_TOKEN_SECRET
require_env REFRESH_TOKEN_SECRET
require_env EMAIL_CONFIRM_SECRET
require_env TURNSTILE_SECRET_KEY

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "[deploy] Compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "[deploy] Env file not found: $ENV_FILE" >&2
  exit 1
fi

if [ ! -f "$SHARED_ENV_FILE" ]; then
  echo "[deploy] Shared env file not found: $SHARED_ENV_FILE" >&2
  exit 1
fi

mkdir -p "$ROOT_DIR/scripts/deploy/certs"

cat "$SHARED_ENV_FILE" "$ENV_FILE" > "$MERGED_ENV_FILE"
trap 'rm -f "$MERGED_ENV_FILE"' EXIT

APP_HOST="$(grep '^APP_HOST=' "$ENV_FILE" | head -n 1 | cut -d '=' -f 2- | sed "s/^'//; s/'$//; s/^\"//; s/\"$//")"
CERT_DOMAIN="$(printf '%s' "$APP_HOST" | sed -E 's#^[a-z]+://([^/]+).*$#\1#')"

if [ -r "/etc/letsencrypt/live/$CERT_DOMAIN/fullchain.pem" ]; then
  sh "$ROOT_DIR/scripts/deploy/sync-certs.sh"
fi

echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" pull

if ! docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans; then
  echo "[deploy] docker compose up failed" >&2
  docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" ps || true

  SERVER_CONTAINER_ID="$(docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" ps -q server 2>/dev/null || true)"

  if [ -n "$SERVER_CONTAINER_ID" ]; then
    SERVER_HEALTH_STATUS="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$SERVER_CONTAINER_ID" 2>/dev/null || true)"
  fi

  echo "[deploy] webserver logs (tail 60):" >&2
  docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" logs --no-color --tail 60 webserver || true

  echo "[deploy] client logs (tail 60):" >&2
  docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" logs --no-color --tail 60 client || true

  echo "[deploy] mongo-express logs (tail 60):" >&2
  docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" logs --no-color --tail 60 mongo-express || true

  if [ -n "$SERVER_CONTAINER_ID" ]; then
    echo "[deploy] server health:" >&2
    printf '%s\n' "$SERVER_HEALTH_STATUS" >&2
    echo "[deploy] server logs (tail 200):" >&2
    docker logs --tail 200 "$SERVER_CONTAINER_ID" || true
  fi

  exit 1
fi
