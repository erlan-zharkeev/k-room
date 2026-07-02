FROM node:24.14.0 AS build

WORKDIR /app

ARG FIREBASE_API_KEY
ENV FIREBASE_API_KEY=${FIREBASE_API_KEY}

RUN corepack enable

COPY package.json ./package.json
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY tsconfig.base.json ./tsconfig.base.json
COPY tsconfig.bundler.json ./tsconfig.bundler.json
COPY .env.shared ./.env.shared
COPY .env.production ./.env.production

COPY global-shared ./global-shared

COPY client/package.json ./client/package.json
COPY client/client-env.types.ts ./client/client-env.types.ts
COPY client/create-client-env-data.ts ./client/create-client-env-data.ts
COPY client/tsconfig.json ./client/tsconfig.json
COPY client/vite.config.ts ./client/vite.config.ts
COPY client/vite.pwa.config.ts ./client/vite.pwa.config.ts
COPY client/index.html ./client/index.html
COPY client/public ./client/public
COPY client/scripts ./client/scripts
COPY client/src ./client/src

RUN pnpm install --frozen-lockfile --filter ./global-shared --filter ./client...

WORKDIR /app/global-shared

RUN pnpm run build

WORKDIR /app/client

RUN pnpm run build

FROM nginx:stable-alpine

COPY nginx/client.conf /etc/nginx/conf.d/default.conf
COPY client/docker-entrypoint.d/10-sync-asset-history.sh /docker-entrypoint.d/10-sync-asset-history.sh
COPY --from=build /app/client/build /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.d/10-sync-asset-history.sh

EXPOSE 80
