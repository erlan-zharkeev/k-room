FROM node:24.14.0 AS build

WORKDIR /app

COPY package.json ./package.json
COPY config/tsconfig/base.json ./config/tsconfig/base.json

COPY common ./common

COPY .env.common ./.env.common
COPY .env.production ./.env.production

COPY server/package.json ./server/package.json
COPY server/package-lock.json ./server/package-lock.json
COPY server/tsconfig.json ./server/tsconfig.json
COPY server/src ./server/src

WORKDIR /app/server

RUN npm ci
RUN npm run build

FROM node:24.14.0

WORKDIR /app

ARG SERVER_PORT=3000
ENV NODE_ENV=production
ENV SERVER_PORT=${SERVER_PORT}

COPY config/tsconfig/base.json ./config/tsconfig/base.json

COPY common ./common

COPY .env.common ./.env.common
COPY .env.production ./.env.production

COPY server/package.json ./server/package.json
COPY server/package-lock.json ./server/package-lock.json
COPY server/public ./server/public

WORKDIR /app/server

RUN npm ci --omit=dev

COPY --from=build /app/server/build ./build

EXPOSE ${SERVER_PORT}

CMD ["node", "./build/index.js"]
