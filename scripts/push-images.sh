#!/bin/bash
# Use this when internet connection will be stable

docker image prune --filter="dangling=true" -f
source update-envs.sh
cd ./
docker build -t ketjo4/k-room-db -f db/Dockerfile .
docker build --rm -t ketjo4/k-room-server -f server/Dockerfile .
docker build --rm -t ketjo4/k-room-client -f client/Dockerfile .

docker push ketjo4/k-room-db
docker push ketjo4/k-room-server
docker push ketjo4/k-room-client
