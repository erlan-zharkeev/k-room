#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/compose.prod.yml}"
SHARED_ENV_FILE="${SHARED_ENV_FILE:-$ROOT_DIR/.env.shared}"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.production}"
SECRET_ENV_FILE="${SECRET_ENV_FILE:-$ROOT_DIR/.env.secret}"
MERGED_ENV_FILE="$ROOT_DIR/.env.deploy"

load_env_fallback_file() {
  file_path="$1"

  if [ ! -f "$file_path" ]; then
    return
  fi

  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      '' | \#*) continue ;;
      *=*) ;;
      *) continue ;;
    esac

    key="${line%%=*}"
    value="${line#*=}"
    case "$key" in
      [A-Za-z_]* ) ;;
      *) continue ;;
    esac
    case "$key" in
      *[!A-Za-z0-9_]* ) continue ;;
    esac

    value="${value#\"}"
    value="${value%\"}"
    value="${value#\'}"
    value="${value%\'}"

    eval "current_value=\${$key:-}"

    if [ -z "$current_value" ] && [ -n "$value" ]; then
      export "$key=$value"
    fi
  done < "$file_path"
}

require_env() {
  var_name="$1"
  eval "var_value=\${$var_name:-}"

  if [ -z "$var_value" ]; then
    echo "[deploy] Missing required env: $var_name" >&2
    exit 1
  fi
}

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

load_env_fallback_file "$SECRET_ENV_FILE"
load_env_fallback_file "$ENV_FILE"
load_env_fallback_file "$SHARED_ENV_FILE"

if [ -z "${TURN_SHARED_SECRET:-}" ] && [ -n "${ACCESS_TOKEN_SECRET:-}" ]; then
  TURN_SHARED_SECRET="$(printf '%s' "k-room-turn-v1:$ACCESS_TOKEN_SECRET" | sha256sum | cut -d ' ' -f 1)"
  export TURN_SHARED_SECRET
fi

require_env DOCKERHUB_USERNAME
require_env DOCKERHUB_TOKEN
require_env MONGO_ADMIN_PASSWORD
require_env RESEND_API_KEY
require_env ADMIN_PASSWORD
require_env ACCESS_TOKEN_SECRET
require_env REFRESH_TOKEN_SECRET
require_env EMAIL_CONFIRM_SECRET
require_env TURNSTILE_SECRET_KEY
require_env TURN_EXTERNAL_IP
require_env TURN_REALM
require_env TURN_SHARED_SECRET
require_env TURN_URLS
require_env VAPID_PRIVATE_KEY

mkdir -p "$ROOT_DIR/scripts/deploy/certs"

cat "$SHARED_ENV_FILE" "$ENV_FILE" > "$MERGED_ENV_FILE"
printf '\n' >> "$MERGED_ENV_FILE"
for env_name in MONGO_ADMIN_PASSWORD RESEND_API_KEY ADMIN_PASSWORD ACCESS_TOKEN_SECRET REFRESH_TOKEN_SECRET EMAIL_CONFIRM_SECRET TURNSTILE_SECRET_KEY TURN_EXTERNAL_IP TURN_REALM TURN_SHARED_SECRET TURN_URLS VAPID_PRIVATE_KEY REDIS_URL; do
  eval "env_value=\${$env_name:-}"
  if [ -n "$env_value" ]; then
    printf '%s=%s\n' "$env_name" "$env_value" >> "$MERGED_ENV_FILE"
  fi
done
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

echo "[deploy] Restarting webserver to refresh upstream DNS"
docker compose --env-file "$MERGED_ENV_FILE" -f "$COMPOSE_FILE" restart webserver
