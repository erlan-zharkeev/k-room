#!/bin/bash

cd ..
yarn
cd ./scripts/
source update-envs.sh &
source types-watch.sh &
source dev-serve-db.sh &
source dev-serve-server.sh &
source dev-serve-client.sh



