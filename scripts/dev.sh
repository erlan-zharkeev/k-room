#!/bin/bash

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "nvm not found at $NVM_DIR" >&2
  exit 1
fi

if [ -f ".nvmrc" ]; then
  nvm use >/dev/null || nvm install
fi

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

npm ci
npm run prepare
chmod +x .husky/pre-commit

docker run -d -p 27017:27017 --name db mongo:latest &

cd ./types
npm ci
npx tsc --watch &

cd ../server/
npm ci
npm run serve &

cd ../client/
npm ci --legacy-peer-deps
npm run serve &

wait
