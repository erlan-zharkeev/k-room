#!/bin/bash

cd ..
cd ./db
docker build -t k-room-db . && docker run -d -p 27017:27017 --rm --name k-room-db k-room-db