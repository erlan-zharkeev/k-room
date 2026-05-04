#!/bin/zsh

ROOT_DIR="${0:A:h:h}"

cd "$ROOT_DIR" || exit $?
. "$ROOT_DIR/scripts/use-node-version.sh" || exit $?
. "$ROOT_DIR/scripts/dev-bootstrap.sh" || exit $?

SERVER_PORT="$(sed -n 's/^SERVER_PORT=//p' .env.shared | head -n 1)"
CLIENT_PORT="$(sed -n 's/^CLIENT_PORT=//p' .env.shared | head -n 1)"
CLIENT_HOST="${APP_HOST:-https://localhost}"
SERVER_HOST="${API_HOST:-https://localhost}"

echo "Client: ${CLIENT_PORT:+$CLIENT_HOST:$CLIENT_PORT}"
echo "Server: ${SERVER_PORT:+$SERVER_HOST:$SERVER_PORT}"
echo "Health: ${SERVER_PORT:+$SERVER_HOST:$SERVER_PORT/health}"

pnpm --dir global-shared run build
pnpm -r --parallel --stream \
  --filter global-shared \
  --filter k-room-client \
  --filter k-room-server \
  run serve
