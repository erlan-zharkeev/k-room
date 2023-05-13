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

- develop call list(7)
- develop add photo(5)
- develop add files(5)
<!-- - develop add video -->
<!-- - develop add audio -->
- Make username unique(3)
- develop forward and reply(10)
- develop reactions(5)
<!-- - make multiple chat() -->
<!-- - make multiple video chat -->
- make notifications from chat(5)
<!-- - make update button(webWorkers) -->
- check token works(1)
- share geolocation
<!-- - delayed messages -->
<!-- - find out how to deploy project for MOBILE and WINDOWS -->
- setup cors to specific host and port(5)
- not found page(3)
- скомпоновать сообщения на бэке(2)
<!-- - auto upgrade version -->
- уменьшить базовые изображения и удаление не нужных(1)
- добавить компрессию файлов(3)
- add hints to buttons(3)
- Сделать доступным поиск автоматическим
- lazy load сообщений(5)
- добавить настройки громкости и чекаем видео(5)
- Инвайты и не допускать сообщения без добаления в контакты(3)
- privacy policy create and to facebook dev
- make gif how to use(2)
-
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
<!-- docker-compose --env-file .env.production up -d webserver -->