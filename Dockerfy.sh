# Recreate Folder #
rm -rf ft_transcendence
mkdir -p ft_transcendence/src

# Copy Core Files #
cp -R .gitignore ft_transcendence/.gitignore
cp -R .git ft_transcendence/.git
cp -R Compose.yml ft_transcendence/Compose.yml
cp -R README.md ft_transcendence/README.md
cp backend/.env ft_transcendence/.env

# Copy App Files #
cp -R backend ft_transcendence/src/backend
cp -R frontend ft_transcendence/src/frontend
cp -R Dockerfile ft_transcendence/src/Dockerfile
cp -R Entrypoint.sh ft_transcendence/src/Entrypoint.sh
cp -R Makefile ft_transcendence/src/Makefile
cp -R package.json ft_transcendence/src/package.json
cp -R package-lock.json ft_transcendence/src/package-lock.json

# Edit Files #
rm ft_transcendence/src/backend/src/game-stats/GameStats.ts
printf "\
e ft_transcendence/src/backend/src/main.ts\n\
4\na\n\
import * as fs from 'fs';\n\
.\n\
8\nc\n\
  const app = await NestFactory.create(AppModule, {\n\
    httpsOptions: {\n\
      key: fs.readFileSync(\`/keys/key.key\`),\n\
      cert: fs.readFileSync(\`/keys/key.pem\`),\n\
    }\n\
  });\n\
.\n\
16\nc\n\
  await app.listen(443);\n\
.\n\
w\n\
e ft_transcendence/src/backend/src/app.module.ts\n\
19\nc\n\
      host: 'postgres',\n\
.\n\
w\n" | ed
