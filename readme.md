# K-Room
##
Production: https://k-room.space

## Pre-install
- To use husky run yarn prepare in root
- Then give rules chmod +x .husky/pre-commit

### Requirements
- node 16.20.0
- pnpm as package manager

## Development
- Run bash dev.sh
- Set in chrome url chrome://flags/#unsafely-treat-insecure-origin-as-secure and put in input field "http://localhost:3001"

## Deploy
- Just merge to main branch


## Common error fix
a) permission denied while trying to connect to the Docker daemon socket
  - use "sudo usermod -aG docker $USER" on remote server

### SSL cert generate
docs - https://mindsers.blog/en/post/https-using-nginx-certbot-docker
- to update certificate docker compose run --rm certbot renew