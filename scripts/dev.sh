#!/bin/zsh

ROOT_DIR="${0:A:h:h}"

cd "$ROOT_DIR" || exit $?
. "$ROOT_DIR/scripts/use-node-version.sh" || exit $?
. "$ROOT_DIR/scripts/dev-bootstrap.sh" || exit $?

SERVER_PORT="$(sed -n 's/^SERVER_PORT=//p' .env.common | head -n 1)"
CLIENT_PORT="$(sed -n 's/^CLIENT_PORT=//p' .env.common | head -n 1)"

echo "Client: ${CLIENT_PORT:+https://localhost:$CLIENT_PORT}"
echo "Server: ${SERVER_PORT:+https://localhost:$SERVER_PORT}"
echo "Health: ${SERVER_PORT:+https://localhost:$SERVER_PORT/health}"

pnpm --dir global-shared run build
pnpm turbo run serve
