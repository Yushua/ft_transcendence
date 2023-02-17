all: stop
	@ docker compose up --build

stop:
	@ docker compose down
	@ docker system prune -f

reset: stop
	@ docker rmi `docker images -q`

.PHONY: all stop reset

run-front:
	cd ./frontend-user ; npm start

run-front:
	cd ./back-end ; npm run start:dev