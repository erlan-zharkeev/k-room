# K-Room

##
Product https://k-room.space

## Commit convention
- To use husky run yarn prepare in root
- Then give rules chmod +x .husky/pre-commit
- The name of the branch should reflect the essence of the added changes, for example, added-list-calls
- To commit changes add changes then call in project root terminal command - git cz, it will start commit wizard(if wizard not appear, run npm install -g commitizen)

## Development
- run bash dev.sh
- set in chrome url chrome://flags/#unsafely-treat-insecure-origin-as-secure and put in input field "http://localhost:3001"

## Create New AWS Instance(Ubuntu image)
- Create and Launch instance on Amazon AWS EC2(while creating don't forget to generate key pair)
- Run chmod 400 /path/key.pem
- Click on connect on Amazon interface switch to ssh tab and copy command(ssh -i "K-Room(v.1.1).pem" ec2-user@ec2-54-204-103-217.compute-1.amazonaws.com)
- Enter to ssh directory in terminal on run command above
- Install Docker sudo yum install -y docker
- Install Docker compose
   1. sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   2. sudo chmod +x /usr/local/bin/docker-compose
- Install git sudo yum install -y git
- Create ssh key pair inside aws instance ssh-keygen -t rsa -b 4096
- Add .pub key to gitlab project
- Get public address from AWS interface and put it to DNS service
- Pull git project git@gitlab.com:ketjo/k-room-aws-deploy.git
- Run bash prod.sh
- To create ssl certificate use this instructions https://mindsers.blog/post/https-using-nginx-certbot-docker/

## TODO List
- setup cors to specific host and port
- check token works
- Add token to socket.io