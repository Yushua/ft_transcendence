all: stop
	@ docker compose up --build

stop:
	@ docker compose down
	@ docker system prune -f

reset: stop
	@ docker rmi `docker images -q`

.PHONY: all stop reset

install:
	npm install
	npm install -save @nestjs/serve-static
	npm install -g @nestjs/cli
	