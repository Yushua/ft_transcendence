runt:
	docker run --name postgres-nest -p 5353:5353 -e POSTGRES_PASSWORD=postgres -d postgres

run:
	docker-compose up -d
	docker-compose ps

stop:
	docker-compose down

remove:
	docker container stop postgres-nest
	docker container rm postgres-nest