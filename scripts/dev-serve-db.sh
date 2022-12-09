#!/bin/bash

cd ..
cd ./db
docker stop k-room-db && docker-compose down --v
docker build -t k-room-db . && docker run -d -p 27017:27017 --rm --name k-room-db k-room-db