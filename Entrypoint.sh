cd ft_transcendence/backend
printf "\
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}\n\
POSTGRES_USER=${POSTGRES_USER}\n\
POSTGRES_DB=${POSTGRES_DB}\n\
POSTGRES_HOST=${POSTGRES_POSTGRES_HOST}\n\
client_id=${client_id}\n\
client_secret=${client_secret}\n\
redirect_uri=${redirect_uri}\n\
LinkRedirect=${LinkRedirect}\n\
state=${state}\n\
JWT_SECRET=${JWT_SECRET}\n\
MAX_PROFILE_PICTURE_SIZE_IN_BYTES=${MAX_PROFILE_PICTURE_SIZE_IN_BYTES}\n\
" > .env
npm run start
