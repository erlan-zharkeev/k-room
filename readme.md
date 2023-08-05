# K-Room

## Development
- run bash dev.sh
- set in chrome url chrome://flags/#unsafely-treat-insecure-origin-as-secure and put in input field "http://localhost:3001"

## Commit convention
- To use husky run yarn prepare
- Branch name should be of the form feat-dd.mm.yy(e.g. create-chat-signature-22.01.23)
- To commit changes add changes then call in project root terminal command - cz, it will start commit wizard(if wizard not appear, run npm install -g commitizen)

## Other
- Add or edit types only in ./types/index.ts file it will autocompile to index.d.ts

## Server works



## Docker hints
- Remove all images - docker rmi $(docker images -a -q)
- Remove all unused images - docker image prune --filter="dangling=true" -f
- docker build -t branchName -f server/Dockerfile .
- delete all volumes docker volume rm $(docker volume ls -q)

## Linux heplers
- Turn to super user - sudo -s
- Check ram - free -m
- Check disk space - df -h
- Delete dir - rm -r dirname

## Backlog
- setup cors to specific host and port
- check token works(1)

## Create New AWS Instance
// Amazon Linux image
- Create and Launch instance on Amazon AWS EC2(while creating generate key pair)
- Run chmod 400 /путь/к/вашему_ключу.pem
- Click on connect on Amazon interface switch to ssh tab and copy command
- Enter to ssh directory in terminal on run command above(ssh -i "K-Room(v.1.1).pem" ec2-user@ec2-54-204-103-217.compute-1.amazonaws.com)
- Install Docker sudo yum install -y docker
- Install Docker compose
   1. sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   2. sudo chmod +x /usr/local/bin/docker-compose
- Install git sudo yum install -y git
- Create ssh key pair inside aws instance ssh-keygen -t rsa -b 4096
- Add .pub key to gitlab project
-
