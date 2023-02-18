#!/bin/bash

cd ..
git restore .
# git checkout development-enable-https
git pull
cd scripts
source update-envs.sh
# docker image prune --filter="dangling=true" -f
docker-compose --env-file .env.production up -d --build
