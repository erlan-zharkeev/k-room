include .env

build:
	docker build -t k-room-server .
run:
	docker run -d -p ${PORT}:${PORT} --rm --name k-room-server k-room-server
br:
	make build && make run
stop:
	docker stop k-room-server && docker rmi k-room-server