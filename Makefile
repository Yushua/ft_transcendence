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

run-back:
	cd ./backend ; npm run start:dev

setup:
	npm install @nestjs/common
	npm install @nestjs/core
	npm i --save @nestjs/config
	npm install --save @nestjs/typeorm typeorm mysql2
	npm install class-validator --save
	npm add bcrypt
	npm add @nestjs/jwt @nestjs/passport passport passport-jwt
	npm install pg --save
	npm install source-map-support
	npm install @nestjs/platform-express

react:
	npm install --save typescript @types/node @types/react @types/react-dom @types/jest
	npm install react-scripts
