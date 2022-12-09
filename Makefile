stop-mongo:
	docker stop k-room-db && docker-compose down --v

# make -j dev(for full development)
dev: mongo-dev server-dev client-dev
mongo-dev:
	cd ./db && docker build -t k-room-db . && docker run -d -p 27017:27017 --rm --name k-room-db k-room-db
server-dev:
	cd ./server && yarn serve
client-dev:
	cd ./client && yarn serve

# docker-dev-build:
# 	docker-compose --env-file .env.development up --build
# docker-prod-build:
# 	docker-compose --env-file .env.production up --build


