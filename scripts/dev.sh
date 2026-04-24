#!/bin/zsh

ROOT_DIR="${0:A:h:h}"

cd "$ROOT_DIR" || exit $?
. "$ROOT_DIR/scripts/use-node-version.sh" || exit $?
. "$ROOT_DIR/scripts/dev-bootstrap.sh" || exit $?

cd "$ROOT_DIR" || exit $?

SERVER_PORT="$(sed -n 's/^SERVER_PORT=//p' .env.common | head -n 1)"
CLIENT_PORT="$(sed -n 's/^CLIENT_PORT=//p' .env.common | head -n 1)"

echo "Client: ${CLIENT_PORT:+https://localhost:$CLIENT_PORT}"
echo "Server: ${SERVER_PORT:+https://localhost:$SERVER_PORT}"
echo "Health: ${SERVER_PORT:+https://localhost:$SERVER_PORT/health}"

cd "$ROOT_DIR/shared" || exit $?
pnpm exec tsc --watch &

cd "$ROOT_DIR/server" || exit $?
pnpm run serve &

cd "$ROOT_DIR/client" || exit $?
pnpm run serve &

wait
