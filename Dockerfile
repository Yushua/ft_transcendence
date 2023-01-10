from debian:bullseye

run apt-get update;\
	apt-get -qq -y install npm;\
	apt-get -qq -y install postgresql postgresql-contrib;

run npm install;\
	npm install -save @nestjs/serve-static;\
	npm install -g @nestjs/cli;

copy ./Entrypoint.sh /Entrypoint.sh
# copy ./source_code /src

entrypoint /Entrypoint.sh
