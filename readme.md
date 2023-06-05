# K-Room

## Development

- run docker
- run bash dev.sh
- set in chrome url chrome://flags/#unsafely-treat-insecure-origin-as-secure and put in input field "http://localhost:3001"

## Deploy

- run bash prod.sh

## If smthng went wrong

- Make shure that node-env is installed: (<https://www.npmjs.com/package/win-node-env>)
- Set project app to recommended node version: 14.20.0

## Commit convention

- To use husky run yarn prepare
- Branch name should be of the form feat-dd.mm.yy(e.g. create-chat-signature-22.01.23)
- To commit changes add changes then call in project root terminal command - cz, it will start commit wizard(if wizard not appear, run npm install -g commitizen)

## Other

- Add or edit types only in ./types/index.ts file it will autocompile to index.d.ts

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
- Make username unique(3)
- Сделать доступным поиск автоматическим(2)
- Инвайты и не допускать сообщения без добаления в контакты(3)
- make multiple chat(5)
- develop add photo(5)
- develop forward and reply(3)
- develop reactions(2)
- добавить настройки громкости и чекаем видео(5)
- develop call list(4)
- setup cors to specific host and port
- check token works(1)
- privacy policy create and to facebook dev
<!-- - lazy load сообщений(5) -->