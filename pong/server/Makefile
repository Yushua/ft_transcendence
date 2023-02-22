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
	npm i --save @nestjs/typeorm
	npm i --save @nestjs/common
	npm i --save class-validator
	npm i --save @nestjs/jwt
	npm i --save @nestjs/websockets @nestjs/platform-socket.io
	npm add socket.io-client
	npm audit fix

# create project: npx create-react-app my-app --template typescript

# npm i --save @nestjs/core
# npm i --save @nestjs/config
# npm i --save @nestjs/typeorm typeorm mysql2
# npm i --save class-validator
# npm i --save class-transformer
# npm i --save pg
# npm i --save @types/react @types/react-dom
# npm i -—save react-scripts
# npm i --save react-shapes
# npm i --save-dev web-vitals
# npm i --save typescript
# npm i --save-dev @types/uuid
# npm i --save-dev @types/passport-jwt
# npm i --save-dev @types/bcrypt
# npm i --save @nestjs/websockets @nestjs/platform-socket.io
# npm add @nestjs/jwt @nestjs/passport passport passport-jwt
