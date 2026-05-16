#!/bin/zsh

ROOT_DIR="${0:A:h:h}"

cd "$ROOT_DIR" || exit $?
. "$ROOT_DIR/scripts/use-node-version.sh" || exit $?
. "$ROOT_DIR/scripts/dev-bootstrap.sh" || exit $?

SERVER_PORT="$(sed -n 's/^SERVER_PORT=//p' .env.shared | head -n 1)"
CLIENT_PORT="$(sed -n 's/^CLIENT_PORT=//p' .env.shared | head -n 1)"
CLIENT_HOST="${APP_HOST:-https://localhost}"
SERVER_HOST="${API_HOST:-https://localhost}"
SERVER_READY_TIMEOUT_SECONDS=120
SERVER_READY_POLL_SECONDS=1
SERVER_READY_REQUEST_TIMEOUT_SECONDS=3
DEV_PIDS=()

echo "Client: ${CLIENT_PORT:+$CLIENT_HOST:$CLIENT_PORT}"
echo "Server: ${SERVER_PORT:+$SERVER_HOST:$SERVER_PORT}"
echo "Health: ${SERVER_PORT:+$SERVER_HOST:$SERVER_PORT/health}"

cleanup_dev_processes() {
  for dev_pid in "${DEV_PIDS[@]}"; do
    kill "$dev_pid" >/dev/null 2>&1 || true
  done

  wait "${DEV_PIDS[@]}" >/dev/null 2>&1 || true
}

start_dev_process() {
  local label="$1"
  shift

  echo "Starting $label..."
  "$@" &
  DEV_PIDS+=("$!")
}

is_dev_process_running() {
  local dev_pid="$1"

  jobs -r -p | grep -qx "$dev_pid"
}

ensure_dev_processes_running() {
  for dev_pid in "${DEV_PIDS[@]}"; do
    if ! is_dev_process_running "$dev_pid"; then
      echo "A dev process stopped before startup finished." >&2
      cleanup_dev_processes
      exit 1
    fi
  done
}

wait_for_server_ready() {
  if [ -z "$SERVER_PORT" ]; then
    echo "Cannot wait for server readiness because SERVER_PORT is missing in .env.shared." >&2
    cleanup_dev_processes
    exit 1
  fi

  if ! command -v curl >/dev/null 2>&1; then
    echo "Cannot wait for server readiness because curl was not found." >&2
    cleanup_dev_processes
    exit 1
  fi

  local health_url="$SERVER_HOST:$SERVER_PORT/health"
  local deadline=$((SECONDS + SERVER_READY_TIMEOUT_SECONDS))

  while [ "$SECONDS" -lt "$deadline" ]; do
    if curl --silent --fail --insecure --max-time "$SERVER_READY_REQUEST_TIMEOUT_SECONDS" "$health_url" >/dev/null; then
      return
    fi

    ensure_dev_processes_running
    sleep "$SERVER_READY_POLL_SECONDS"
  done

  echo "Server did not become ready within ${SERVER_READY_TIMEOUT_SECONDS} seconds." >&2
  echo "Check the server logs above, then run pnpm dev again." >&2
  cleanup_dev_processes
  exit 1
}

wait_for_any_dev_process_exit() {
  while true; do
    for dev_pid in "${DEV_PIDS[@]}"; do
      if ! is_dev_process_running "$dev_pid"; then
        wait "$dev_pid"
        return $?
      fi
    done

    sleep 1
  done
}

trap 'cleanup_dev_processes; exit 130' INT
trap 'cleanup_dev_processes; exit 143' TERM

pnpm --dir global-shared run build
start_dev_process "global-shared" pnpm --dir global-shared run serve
start_dev_process "client" pnpm --dir client run serve
start_dev_process "server" pnpm --dir server run serve
wait_for_server_ready

wait_for_any_dev_process_exit
DEV_EXIT_CODE=$?
cleanup_dev_processes
exit "$DEV_EXIT_CODE"
