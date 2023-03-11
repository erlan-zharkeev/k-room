# K-Room

## Development

- run docker
- run cd ./scripts && bash dev.sh
- run in chrome url chrome://flags/#unsafely-treat-insecure-origin-as-secure and put in input field "http://localhost:3001"

## Deploy

- run cd ./script && bash prod-build.sh

## If smthng went wrong

- Make shure that node-env is installed: (<https://www.npmjs.com/package/win-node-env>)
- Set project app to recommended node version: 14.20.0

## Commit convention

- To use husky run yarn prepare
- Branch name should be of the form type-dd.mm.yy(e.g. development-22.01.23)
- To commit changes add changes then call in project root terminal command - cz, it will start commit wizard(if wizard not appear, run npm install -g commitizen)

## Avoid

- Add or edit types only in ./types/index.ts file it will autocompile to index.d.ts
  Do not edit nested .env files(edit only in root)

## Server works

- Install docker and docker-compose

  sudo apt-get update
  sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL <https://download.docker.com/linux/ubuntu/gpg> | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] <https://download.docker.com/linux/ubuntu> \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update
  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo apt install docker-compose

- If low ram increase it by use swap file

    mkdir -p /var/swapmemory
    cd /var/swapmemory
    dd if=/dev/zero of=swapfile bs=1M count=4000
    mkswap swapfile
    swapon swapfile
    chmod 600 swapfile

- Make ports open

- Update/create certificate
  run certbot container
  run "docker compose run --rm certbot renew"
  for more info "https://mindsers.blog/post/https-using-nginx-certbot-docker/"

## Docker hints

- Remove all images - docker rmi $(docker images -a -q)
- Remove all unused images - docker image prune --filter="dangling=true" -f
- docker build -t branchName -f server/Dockerfile .
- delete all volumes docker volume rm $(docker volume ls -q)

## Ubuntu hints

- Turn to super user - sudo -s
- Check ram - free -m
- Check disk space - df -h
- Delete dir - rm -r dirname

## Backlog

- develop call list
- develop add photo
- develop add files
- develop add video
- develop add audio
- Make username unique
- develop forward and reply
- develop reactions
- make multiple chat
- make multiple video chat
- make notifications from chat
- make update button(webWorkers)
- check token works
- make google/facebook authorization
- make cookie checker
- make gif how to use
- share geolocation
- delayed messages
- find out how to deploy project for MOBILE and WINDOWS
- setup cors to specific host and port
- logo in email
- types any and unknown
- not found page
- скомпоновать сообщения на бэке
- восстановление пароля
- auto upgrade version
- уменьшить базовые изображения и удаление не нужных
- добавить компрессию файлов
- add hints to buttons
- Сделать доступным поиск автоматическим
- Убрать дергание switcher
- lazy load сообщений


docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
<!-- docker-compose --env-file .env.production up -d webserver -->