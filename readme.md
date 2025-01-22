# K-Room
##
Production: https://k-room.space (Temporarily closed)

![App main screen](./main-screen.png 'main screen')

![App call screen](./call-screen.png 'call screen')

## Pre-install
- To use husky run pnpm prepare in root
- Then give rules chmod +x .husky/pre-commit

### Requirements
- node 16.20.0
- pnpm as package manager

## Development
- Add variables to bash K_ROOM_MAIL_PASS, VITE_FIREBASE_API_KEY
- Run bash dev.sh

## Deploy
- Just merge to main branch


## Common error fix
a) permission denied while trying to connect to the Docker daemon socket
  - use "sudo usermod -aG docker $USER" on remote server(wait for 2-3 min before restart)

### SSL cert generate
docs - https://mindsers.blog/en/post/https-using-nginx-certbot-docker
- to update certificate run "docker compose run --rm certbot renew" on the remote server
