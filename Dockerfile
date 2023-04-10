from node

run apt-get update && apt-get install -y openssl

copy . /ft_transcendence

run cd /ft_transcendence; npm install
# run cd /ft_transcendence; make react
# run cd /ft_transcendence; make setup
run cd /ft_transcendence/frontend; npm run build

run mkdir -p /keys;\
    cd /keys;\
    openssl req\
        -newkey rsa:2048 -x509 -sha256 -nodes \
        -out "/keys/key.pem"\
        -keyout "/keys/key.key"\
        -subj "/C=NL/ST=Amsterdam/L=Amsterdam/O=Codam/OU=IT/CN=transcendence"

entrypoint /ft_transcendence/Entrypoint.sh
