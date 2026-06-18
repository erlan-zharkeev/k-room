<p align="center">
  <img src="client/public/img/app-icon.svg" width="96" height="96" alt="K-Room icon" />
</p>

# K-Room

K-Room is a chat and communication app with a Vue/Tauri client, Node server, local IndexedDB storage, media handling, and production deployment through Docker.

## Requirements

- pnpm 10 as package manager
- Docker for correct development environment startup

## Development

- Enable pnpm once if needed: `corepack enable`
- Add variables to bash `RESEND_API_KEY`, `EMAIL_CONFIRM_SECRET`, `FIREBASE_API_KEY`
- Generate local HTTPS certificates once and place them in `dev-certs/`:
  - `dev-certs/k-room-dev.pem`
  - `dev-certs/k-room-dev-key.pem`
- Add `127.0.0.1 k-room-dev` to `/etc/hosts`
- Run `pnpm dev`
- Client opens automatically at `https://k-room-dev:43101`
- Update `@nmorph/nmorph-ui-kit`: `pnpm update:nmorph`

## Checks

- CI runs `pnpm run check`.
- The local pre-commit hook runs `pnpm run check`.
- Smoke and e2e tests are manual local checks.
- Run `pnpm run smoke` for smoke tests or `pnpm run e2e` for the full e2e suite.
- Smoke and e2e tests require MongoDB on `127.0.0.1:27017`.

## Production Deploy

Production deploy is not triggered by a normal push to `production`.

To deploy, use a clean local `production` branch and run:

```sh
pnpm run deploy
```

The command creates and pushes an empty commit with this message:

```text
deploy(production): trigger
```

GitHub Actions deploys only when the latest pushed commit on `production` starts with `deploy(production):`.

## Docs

- [Repository rules](./REPOSITORY_RULES.md)
- [Backlog](./BACKLOG.md)
