# make -j dev(for full development)

mongo-dev:
	cd ./db && docker build -t k-room-db . && docker run -d -p 27017:27017 --rm --name k-room-db k-room-db
server-dev:
	cd ./server && yarn serve
client-dev:
	cd ./client && yarn serve

stop-mongo:
	docker stop k-room-db && docker-compose down --v

dev: mongo-dev server-dev client-dev

local-prod: docker-compose up --build