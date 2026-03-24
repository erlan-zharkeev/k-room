# K-Room

##

Production: https://k-room.space (Temporarily closed)

![App main screen](./docs/assets/main-screen.png 'main screen')

![App call screen](./docs/assets/call-screen.png 'call screen')

## Pre-install

- Husky is initialized automatically by `sh scripts/dev.sh`

### Requirements

- node 24.14.0
- npm as package manager

## Development

- Add variables to bash `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME`, `EMAIL_CONFIRM_SECRET`, `VITE_FIREBASE_API_KEY`
- Run `sh scripts/dev.sh`

### Package managers

- root, `client`, `server`, and `types` use `npm`

## Deploy

- Just merge to main branch
