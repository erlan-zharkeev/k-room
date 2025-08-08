#!/bin/bash
node_pids=""

get_node_pids() {
  node_pids=$(ps aux | grep 'node' | awk '{print $2}')
}

cleanup() {
  for pid in $node_pids; do
    kill $pid
  done
}

trap cleanup EXIT

pnpm install

docker-compose up -f -d docker-compose-dev.yml

cd ./types
pnpm install
npx tsc --watch &

cd ../server/
pnpm install
pnpm run serve &

# cd ../client/
# pnpm install
# pnpm run serve &

wait