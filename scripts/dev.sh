#!/bin/zsh

zsh ./scripts/dev-bootstrap.sh || exit $?

cd ./common
npx tsc --watch &

cd ../server/
npm run serve &

cd ../client/
npm run serve &

wait
