## Development

- run cd ./scripts && bash dev.sh

## Deploy

- run cd ./script && bash prod-build.sh

## If smthng went wrong

- Make shure that node-env is installed: (<https://www.npmjs.com/package/win-node-env>)
- Set frontend app to recommended node version: 14.20.0

## Commit convention

- to use husky run yarn prepare
- branch name should be of the form type-dd/mm(e.g. develop-20/08)
- to commit changes call in project root terminal command - cz, it will start commit wizard(if wizard not appear, run npm install -g commitizen)

## Avoid

- Add or edit types only in ./types/index.ts file it will autocompile to index.d.ts
- Do not edit nested .env files(edit only in root)

## Docker hints

- Remove all images - docker rmi $(docker images -a -q)

## Server Ubuntu hints

- Turn to super user - sudo -s
- Check ram - free -m
- Check disk space - df -h
- Delete dir - rm -r ${dir}

## Server prepare

- Install docker and docker-compose
- Make that ports are open
- If low ram increase it by use swap file
    mkdir -p /var/swapmemory
    cd /var/swapmemory
    #Here, 1M * 2000 ~= 2GB of swap memory
    dd if=/dev/zero of=swapfile bs=1M count=2000
    mkswap swapfile
    swapon swapfile
    chmod 600 swapfile