all: stop
	@ docker compose up --build

stop:
	@ docker compose down
	@ docker system prune -f

reset: stop
	@ docker rmi `docker images -q`

.PHONY: all stop reset

run-frontdev:
	cd ./frontend ; npm start

run-front:
	cd ./frontend ; npm run build

run-back:
	cd ./backend ; npm run start:dev

run-docker:
	bash Entrypoint.sh

setup:
	npm i @nestjs/common
	npm i @nestjs/core
	npm i @nestjs/config
	npm i @nestjs/typeorm typeorm mysql2
	npm i class-validator
	npm i bcrypt
	npm i @nestjs/jwt @nestjs/passport passport passport-jwt
	npm i pg
	npm i source-map-support
	npm i @nestjs/platform-express
	npm i socket.io-client
	npm i socket.io
	npm i @nestjs/websockets
	npm i @nestjs/platform-socket.io
	npm i -D @types/multer
	npm i validate-image-type
	npm install dotenv
	npm install otplib --save
	npm install crypto-js --save
	npm i --save-dev @types/qrcode
	npm i --save @nestjs/throttler

react:
	npm i typescript @types/node @types/react @types/react-dom @types/jest
	npm i react-scripts
	npm i @mui/material @emotion/react @emotion/styled
	npm i @mui/x-data-grid
	npm i immutability-helper

