# K-Room

##

![App main screen](./docs/assets/main-screen.png 'main screen')

![App call screen](./docs/assets/call-screen.png 'call screen')

### Requirements

- npm as package manager
- Docker for correct development environment startup

## Development

- Add variables to bash `RESEND_API_KEY`,`EMAIL_CONFIRM_SECRET`, `FIREBASE_API_KEY`
- Generate local HTTPS certificates once and place them in root `dev-certs/`:
  - `dev-certs/k-room-dev.pem`
  - `dev-certs/k-room-dev-key.pem`
- Add `127.0.0.1 k-room-dev` to `/etc/hosts`
- Open the client at `https://k-room-dev:3001`
- Run `npm run dev`
