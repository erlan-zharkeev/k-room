include .env

build:
	docker build -t k-room .
run:
	docker run -d -p ${PORT}:${PORT} --rm --name k-room k-room
br:
	make build && make run
stop:
	docker stop k-room && docker rmi k-room