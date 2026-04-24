FROM node:24.14.0 AS build

WORKDIR /app

RUN corepack enable

COPY package.json ./package.json
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY config/tsconfig/base.json ./config/tsconfig/base.json

COPY common ./common

COPY .env.production ./.env.production

COPY client/package.json ./client/package.json
COPY client/tsconfig.json ./client/tsconfig.json
COPY client/tsconfig.node.json ./client/tsconfig.node.json
COPY client/vite.config.ts ./client/vite.config.ts
COPY client/vite.pwa.config.ts ./client/vite.pwa.config.ts
COPY client/vitest.config.ts ./client/vitest.config.ts
COPY client/vitest.setup.ts ./client/vitest.setup.ts
COPY client/index.html ./client/index.html
COPY client/public ./client/public
COPY client/src ./client/src

RUN pnpm install --frozen-lockfile --filter ./client...

WORKDIR /app/client

RUN pnpm run build

FROM nginx:stable-alpine

COPY config/nginx/client.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/build /usr/share/nginx/html

EXPOSE 80
