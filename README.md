# K-Room

##

Production domains: `APP_HOST` and `API_HOST` from `.env.production`

![App main screen](./docs/assets/main-screen.png 'main screen')

![App call screen](./docs/assets/call-screen.png 'call screen')

## Pre-install

- Husky is initialized automatically by `sh scripts/dev.sh`

### Requirements

- npm as package manager

## Development

- Add variables to bash `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME`, `EMAIL_CONFIRM_SECRET`,`FIREBASE_API_KEY`, `SENTRY_DSN_CLIENT`, `SENTRY_DSN_SERVER`
- Run `sh scripts/dev.sh`
