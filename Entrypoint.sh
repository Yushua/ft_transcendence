# cp -R /src /ft_transcendence
# nest new ft_transcendence
# nest new src
service postgresql restart
cd src
echo "\033[36;1m    -~={ Installing... }=~\033[0m"
npm install
echo "\033[36;1m    -~={ Launching... }=~\033[0m"
npm run start
