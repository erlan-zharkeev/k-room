# K-Room

##

Production domains: `APP_HOST` and `API_HOST` from `.env.production`

![App main screen](./docs/assets/main-screen.png 'main screen')

![App call screen](./docs/assets/call-screen.png 'call screen')

## Pre-install

- Husky is initialized automatically by `npm run dev`

### Requirements

- npm as package manager
- Docker for correct development environment startup

## Development

- Add variables to bash `RESEND_API_KEY`, `EMAIL_CONFIRM_SECRET`, `FIREBASE_API_KEY`, `SENTRY_DSN_CLIENT`, `SENTRY_DSN_SERVER`
- Run `npm run dev`
