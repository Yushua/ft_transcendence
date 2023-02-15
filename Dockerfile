FROM debian:bullseye

RUN apt-get update;\
	apt-get -qq -y install npm;\
	apt-get -qq -y install postgresql postgresql-contrib;

RUN npm install;\
	npm install -save @nestjs/serve-static;\
	npm install -g @nestjs/cli;

COPY ./Entrypoint.sh /Entrypoint.sh
# copy ./source_code /src

ENTRYPOINT /Entrypoint.sh
