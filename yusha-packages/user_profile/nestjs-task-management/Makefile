run:
	docker-compose up -d
	docker-compose ps

stop:
	docker-compose down

remove:
	docker container stop postgres-nest
	docker container rm postgres-nest

test:
	npm run start:dev

gethostname:
	# docker inspect nestjs-task-management_pgadmin_1 | grep IPAddress
	docker inspect nestjs-task-management_postgres_1 | grep IPAddress

setup:
	npm install @nestjs/common
	npm install @nestjs/core
	npm i --save @nestjs/config
	npm install --save @nestjs/typeorm typeorm mysql2
	npm install class-validator --save
	npm add bcrypt