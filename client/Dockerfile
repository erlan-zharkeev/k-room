FROM node:24.14.0 AS build

WORKDIR /app

COPY package.json ./package.json
COPY config/tsconfig/base.json ./config/tsconfig/base.json

COPY common/index.ts ./common/index.ts
COPY common/package.json ./common/package.json
COPY common/package-lock.json ./common/package-lock.json
COPY common/tsconfig.json ./common/tsconfig.json
COPY common/lib ./common/lib
COPY common/types ./common/types

COPY .env.production ./.env.production

COPY client/package.json ./client/package.json
COPY client/package-lock.json ./client/package-lock.json
COPY client/tsconfig.json ./client/tsconfig.json
COPY client/tsconfig.node.json ./client/tsconfig.node.json
COPY client/vite.config.ts ./client/vite.config.ts
COPY client/vite.pwa.config.ts ./client/vite.pwa.config.ts
COPY client/vitest.config.ts ./client/vitest.config.ts
COPY client/vitest.setup.ts ./client/vitest.setup.ts
COPY client/index.html ./client/index.html
COPY client/public ./client/public
COPY client/src ./client/src

RUN cd /app/client && npm ci --legacy-peer-deps

WORKDIR /app/client

RUN npm run build

FROM nginx:stable-alpine

COPY config/nginx/client.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/build /usr/share/nginx/html

EXPOSE 80
