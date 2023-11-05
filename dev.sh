#!/bin/bash
pkill node
pnpm install

docker build -t k-room-db . && docker run -d -p 27017:27017 --rm --name k-room-db k-room-db &

cd ./types
pnpm install
npx tsc --watch &

cd ../server/
pnpm install
pnpm run serve &

cd ../client/
pnpm install
pnpm run serve &
