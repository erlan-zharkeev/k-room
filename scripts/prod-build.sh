#!/bin/bash

cd ..
git checkout main
git pull
cd scripts
source update-envs.sh
docker image prune --filter="dangling=true" -f
docker-compose --env-file .env.production up --build