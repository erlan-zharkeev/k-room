FROM node:24.14.0 AS build

WORKDIR /app

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
COPY client/tsconfig.json ./client/tsconfig.json
COPY client/vite.config.ts ./client/vite.config.ts
COPY client/index.html ./client/index.html
COPY client/src ./client/src

RUN pnpm install --frozen-lockfile --filter ./client...

WORKDIR /app/client

RUN pnpm run build

FROM nginx:stable-alpine

COPY nginx/client.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/build /usr/share/nginx/html

EXPOSE 80
