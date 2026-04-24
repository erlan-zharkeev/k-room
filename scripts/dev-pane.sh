#!/bin/zsh

ROOT_DIR="${0:A:h:h}"
ROLE="$1"

if [ -z "$ROLE" ]; then
  echo "Usage: zsh scripts/dev-pane.sh <server|client>" >&2
  exit 1
fi

cd "$ROOT_DIR" || exit $?
. "$ROOT_DIR/scripts/use-node-version.sh" || exit $?

SERVER_PORT="$(sed -n 's/^SERVER_PORT=//p' .env.common | head -n 1)"
CLIENT_PORT="$(sed -n 's/^CLIENT_PORT=//p' .env.common | head -n 1)"

types_pid=""

cleanup() {
  if [ -n "$types_pid" ] && kill -0 "$types_pid" 2>/dev/null; then
    kill "$types_pid" 2>/dev/null
    wait "$types_pid" 2>/dev/null
  fi
}

trap cleanup EXIT INT TERM

case "$ROLE" in
  server)
    echo "Server: ${SERVER_PORT:+https://localhost:$SERVER_PORT}"
    echo "Health: ${SERVER_PORT:+https://localhost:$SERVER_PORT/health}"

    cd "$ROOT_DIR/shared" || exit $?
    pnpm exec tsc --watch &
    types_pid="$!"

    cd "$ROOT_DIR/server" || exit $?
    pnpm run serve
    ;;
  client)
    echo "Client: ${CLIENT_PORT:+https://localhost:$CLIENT_PORT}"

    cd "$ROOT_DIR/client" || exit $?
    pnpm run serve
    ;;
  *)
    echo "Unknown dev pane: $ROLE" >&2
    exit 1
    ;;
esac
