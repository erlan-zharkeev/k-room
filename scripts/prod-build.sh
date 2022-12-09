#!/bin/bash

source update-envs.sh
docker-compose --env-file .env.production up --build