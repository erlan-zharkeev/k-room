#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
HOOK_PATH="/etc/letsencrypt/renewal-hooks/deploy/k-room-sync-certs.sh"

sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo tee "$HOOK_PATH" >/dev/null <<EOF
#!/bin/sh
set -eu
APP_ROOT="$ROOT_DIR"
sh "\$APP_ROOT/deploy-scripts/sync-certs.sh"
docker compose --env-file "\$APP_ROOT/.env.production" --env-file "\$APP_ROOT/.env.runtime" -f "\$APP_ROOT/compose.prod.yml" up -d webserver
EOF
sudo chmod 755 "$HOOK_PATH"

echo "[cert-hook] Installed: $HOOK_PATH"
