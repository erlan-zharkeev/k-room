#!/bin/bash
pkill node
yarn
cd ./scripts/
source types-watch.sh &
source dev-serve-db.sh &
source dev-serve-server.sh &
source dev-serve-client.sh