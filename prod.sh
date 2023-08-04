#!/bin/bash

git restore .
git pull
cd scripts
docker image prune --filter="dangling=true" -f
docker-compose --env-file .env.production up -d --build


# docker-compose --env-file .env.production build
