## Development

- run cd ./scripts && bash dev.sh

  chrome://flags/#unsafely-treat-insecure-origin-as-secure
  http://k-room.space

## Deploy

- run cd ./script && bash prod-build.sh

## If smthng went wrong

- Make shure that node-env is installed: (<https://www.npmjs.com/package/win-node-env>)
- Set frontend app to recommended node version: 14.20.0

## Commit convention

- To use husky run yarn prepare
- Branch name should be of the form type-dd.mm.yy(e.g. development-22.01.23)
- To commit changes add changes then call in project root terminal command - cz, it will start commit wizard(if wizard not appear, run npm install -g commitizen)

## Avoid

- Add or edit types only in ./types/index.ts file it will autocompile to index.d.ts
  Do not edit nested .env files(edit only in root)

## Docker hints

- Remove all images - docker rmi $(docker images -a -q)
- Remove all unused images - docker image prune --filter="dangling=true" -f
- docker build -t branchName -f server/Dockerfile .

## Server Ubuntu hints

- Turn to super user - sudo -s
- Check ram - free -m
- Check disk space - df -h
- Delete dir - rm -r dirname

## Server prepare

- Install docker and docker-compose

  sudo apt-get update
  sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
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
