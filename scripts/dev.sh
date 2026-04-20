#!/bin/zsh

ROOT_DIR="${0:A:h:h}"

. "$ROOT_DIR/scripts/use-node-version.sh" || exit $?
zsh "$ROOT_DIR/scripts/dev-bootstrap.sh" || exit $?

cd "$ROOT_DIR/common" || exit $?
npx tsc --watch &

cd "$ROOT_DIR/server" || exit $?
npm run serve &

cd "$ROOT_DIR/client" || exit $?
npm run serve &

cd "$ROOT_DIR" || exit $?
npm run lint:fsd:watch &

wait
