#!/bin/bash

cd ..
git restore .
git checkout development-enable-https
git pull
cd scripts
source update-envs.sh
docker image prune --filter="dangling=true" -f
docker-compose --env-file .env.production up --build

# docker stop $(docker ps -aq)
# docker rm $(docker ps -aq)
# docker-compose --env-file .env.production up -d webserver