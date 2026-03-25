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
started_mongo_container=""
started_mongo_express_container=""

get_node_pids() {
  node_pids=$(ps aux | grep 'node' | awk '{print $2}')
}

cleanup() {
  for pid in $node_pids; do
    kill $pid
  done

  if [ -n "$started_mongo_express_container" ]; then
    docker stop "$started_mongo_express_container" >/dev/null 2>&1
  fi

  if [ -n "$started_mongo_container" ]; then
    docker stop "$started_mongo_container" >/dev/null 2>&1
  fi
}

trap cleanup EXIT

npm ci
npm run prepare
chmod +x .husky/pre-commit

if ! docker ps --format '{{.Names}}' | grep -qx 'db'; then
  if docker ps -a --format '{{.Names}}' | grep -qx 'db'; then
    docker start db >/dev/null
  else
    docker run -d -p 27017:27017 --name db mongo:latest >/dev/null
    started_mongo_container='db'
  fi
fi

if ! docker ps --format '{{.Names}}' | grep -qx 'mongo-express'; then
  if docker ps -a --format '{{.Names}}' | grep -qx 'mongo-express'; then
    docker start mongo-express >/dev/null
  else
    docker run -d \
      -p 8081:8081 \
      --name mongo-express \
      -e ME_CONFIG_BASICAUTH_USERNAME=admin \
      -e ME_CONFIG_BASICAUTH_PASSWORD=admin \
      -e ME_CONFIG_MONGODB_URL='mongodb://host.docker.internal:27017/k-room-db' \
      mongo-express:latest >/dev/null
    started_mongo_express_container='mongo-express'
  fi
fi

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
