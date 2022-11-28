# make -j all(for full development)

mongo-dev:
	cd ./db && docker build -t k-room-db . && docker run -d -p 27017:27017 --rm --name k-room-db k-room-db
server-dev:
	cd ./server && yarn serve
client-dev:
	cd ./client && yarn serve

dev: mongo-dev server-dev client-dev

local-prod: docker-compose up --build