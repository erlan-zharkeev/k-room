#!/bin/bash

cd ..
cp ./.env.development ./client/_env && cp ./.env.development ./server/_env && cp ./.env.production ./client/_env && cp ./.env.production ./server/_env
