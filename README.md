<p align="center">
  <img src="client/public/img/app-icon.svg" width="96" height="96" alt="K-Room icon" />
</p>

# K-Room

K-Room is a chat and communication app with a Vue/Tauri client, Node server, local IndexedDB storage, media handling, and production deployment through Docker.

## Requirements

- pnpm 10 as package manager
- Docker for correct development environment startup
- OpenSSL, or Git for Windows with OpenSSL, when dev certificates must be generated

## Development

- Enable pnpm once if needed: `corepack enable`
- Add required values to `.env.development` or `.env.secret`: `RESEND_API_KEY`, `EMAIL_CONFIRM_SECRET`, `FIREBASE_API_KEY`
- The dev script generates local HTTPS certificates in `dev-certs/` when they are missing:
  - `dev-certs/k-room-dev.pem`
  - `dev-certs/k-room-dev-key.pem`
- Add `127.0.0.1 k-room-dev` to your hosts file
- Run `pnpm run dev`
- Open the client at `https://k-room-dev:43101`
- Update `@nmorph/nmorph-ui-kit`: `pnpm run update:nmorph`

### LAN Development

Use `pnpm run dev:lan` when the app must be opened from another device on the same local network, for example from a phone while testing camera, microphone, WebRTC, or mobile layout.

`dev:lan` runs the same startup flow as `dev`, but passes `--lan` to `scripts/dev.mjs`. In LAN mode the script overrides `APP_HOST` and `API_HOST` to the selected LAN IP, so the printed client and server URLs use the machine LAN IP instead of `https://k-room-dev`.

To configure LAN mode for a different network:

1. Find this machine's LAN IPv4 address, for example with `ipconfig` on Windows.
2. Run `pnpm run dev:lan -- <LAN_IP>`, for example `pnpm run dev:lan -- 192.168.1.42`.
3. Or set `LAN_IP` before running `pnpm run dev:lan`. Without an explicit IP, LAN mode uses `192.168.8.7`.
4. The dev script regenerates the local certificate when the configured LAN IP changes.
5. Allow inbound connections to the dev ports if the firewall asks:
   - client: `43101`
   - server: `43107`
6. Open `https://<LAN_IP>:43101` on the other device.

Both devices must be on the same network. Because the certificate is local and self-signed, the browser on the other device may ask you to trust or continue to the dev site.

### Admin Panel

The admin panel is served by the server app at `ADMIN_ROOT_PATH`, which is `/admin-panel` by default.

| Mode              | Command                                              | Admin panel URL                                                                                                        |
| ----------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Local development | `pnpm run dev`                                       | `https://k-room-dev:43107/admin-panel`                                                                                 |
| LAN development   | `pnpm run dev:lan` or `pnpm run dev:lan -- <LAN_IP>` | `https://192.168.8.7:43107/admin-panel` by default, or `https://<LAN_IP>:43107/admin-panel` when a custom IP is passed |
| Production        | `pnpm run deploy`                                    | `https://api.k-room.space/admin-panel`                                                                                 |

Admin credentials are read from `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the active environment files.

## Root Package Scripts

These commands are defined in the root `package.json`.

| Command                       | What it does                                                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm run dev`                | Installs workspace dependencies, prepares Husky, ensures dev certificates, starts Docker services, builds `global-shared`, then runs `global-shared`, `client`, and `server` in watch mode. |
| `pnpm run dev:lan`            | Runs the same flow as `dev`, but exposes the app through the default or passed LAN IP for testing from another device.                                                                      |
| `pnpm run update:nmorph`      | Updates `@nmorph/nmorph-ui-kit` in `client` to the latest version and builds the client.                                                                                                    |
| `pnpm run husky-prepare`      | Installs Git hooks through Husky. It is called by `dev`.                                                                                                                                    |
| `pnpm run sync:public-config` | Generates `nginx/webserver.conf` from `nginx/webserver.template.conf` using `.env.shared` and `.env.production`.                                                                            |
| `pnpm run format:fix`         | Formats the repository with Prettier.                                                                                                                                                       |
| `pnpm run build`              | Runs all package build tasks through Turbo.                                                                                                                                                 |
| `pnpm run typecheck`          | Runs application and test type checks through Turbo.                                                                                                                                        |
| `pnpm run lint:es`            | Runs ESLint for workspace packages, e2e tests, and Playwright config.                                                                                                                       |
| `pnpm run lint:style`         | Runs style linting through Turbo.                                                                                                                                                           |
| `pnpm run lint:fsd`           | Runs client FSD boundary linting.                                                                                                                                                           |
| `pnpm run lint:all`           | Runs FSD, ESLint, and style lint checks.                                                                                                                                                    |
| `pnpm run lint:fsd:watch`     | Runs the client FSD linter in watch mode.                                                                                                                                                   |
| `pnpm run lint:fix`           | Applies ESLint and Stylelint fixes through Turbo.                                                                                                                                           |
| `pnpm run e2e`                | Runs the full Playwright e2e suite.                                                                                                                                                         |
| `pnpm run e2e:ui`             | Opens the Playwright UI runner.                                                                                                                                                             |
| `pnpm run smoke`              | Runs Playwright tests marked with `@smoke`.                                                                                                                                                 |
| `pnpm run check`              | Runs the full local quality gate: FSD lint, ESLint, style lint, type checks, builds, tests, and Prettier check.                                                                             |
| `pnpm run deploy`             | Bumps the client app patch version, creates the production deploy trigger commit, and pushes it. It only works from a clean `production` branch.                                            |
| `pnpm run test`               | Runs workspace test tasks through Turbo.                                                                                                                                                    |

## Scripts Directory

The root `scripts/` directory contains implementation files used by the package scripts and deployment workflow.

| File                                                    | What it does                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/dev.mjs`                                       | Implements `dev` and `dev:lan`: loads env files, validates required env, prepares certificates, applies the optional LAN IP, starts required Docker containers (`db`, `mongo-express`, `k-room-redis`), builds shared contracts, starts dev services, waits for server health, and restarts the server process if it exits. |
| `scripts/desktop/prepare-desktop-download-artifact.mjs` | Collects platform-specific Tauri build output, normalizes public installer names, and stores installer metadata for the production Docker image build.                                                                                                                                                                      |
| `scripts/desktop/finalize-desktop-downloads.mjs`        | Rebuilds `client/public/downloads` from desktop installer artifacts and generates the public download manifest plus the Tauri updater `latest.json` file before the client Docker image is built.                                                                                                                           |
| `scripts/sync-public-config.mjs`                        | Reads shared and stage env files, extracts public domains and paths, and writes `nginx/webserver.conf` from the nginx template.                                                                                                                                                                                             |
| `scripts/deploy/create-production-deploy-commit.mjs`    | Checks that the current branch is clean `production`, bumps the client app version, creates a `deploy(production): v...` commit, and pushes it.                                                                                                                                                                             |
| `scripts/version/bump-client-version.mjs`               | Bumps `client/package.json` and `client/src-tauri/Cargo.toml`; patch is the default bump, while minor and major require explicit flags.                                                                                                                                                                                     |
| `scripts/deploy/deploy.sh`                              | Server-side production deploy script used by GitHub Actions or the host: merges env files, syncs certificates when available, logs in to Docker Hub, pulls images, and runs Docker Compose.                                                                                                                                 |
| `scripts/deploy/sync-certs.sh`                          | Copies Let's Encrypt certificate files for the production domain into `scripts/deploy/certs/` for Docker Compose.                                                                                                                                                                                                           |

## Checks

- CI runs `pnpm run check`.
- The local pre-commit hook runs `pnpm run check`.
- Smoke and e2e tests are manual local checks and are not part of `pnpm run deploy` or the GitHub Actions production deploy flow.
- Run `pnpm run smoke` for smoke tests or `pnpm run e2e` for the full e2e suite.
- Smoke and e2e tests require MongoDB on `127.0.0.1:27017`.

## Production Deploy

Production deploy is not triggered by a normal push to `production`.

To deploy, use a clean local `production` branch and run:

```sh
pnpm run deploy
```

The command bumps the client app patch version by default, for example `0.1.0` to `0.1.1`, then creates and pushes a commit with a message like:

```text
deploy(production): v0.1.1
```

Use explicit flags for larger release bumps:

```sh
pnpm run deploy -- --minor
pnpm run deploy -- --major
```

Only `client/package.json` and `client/src-tauri/Cargo.toml` are bumped automatically. The root and server package versions stay manual.

GitHub Actions deploys only when the latest pushed commit on `production` starts with `deploy(production):`.

The production workflow builds Windows and macOS Tauri installers before publishing Docker images. The client Docker image is built only after the installer artifacts are available, so `/downloads/K-Room-Setup.exe`, `/downloads/K-Room.dmg`, and `/downloads/desktop/latest.json` are shipped together with the web client.

The desktop installer jobs require `TAURI_SIGNING_PRIVATE_KEY`. It can be provided either as a dedicated GitHub secret or inside the decoded `ENV_SECRET_B64` `.env.secret` payload. If the updater key has a password, also set `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` the same way.

## Docs

- [Repository rules](./REPOSITORY_RULES.md)
- [Backlog](./BACKLOG.md)
