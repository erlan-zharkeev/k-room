FROM node:24.14.0 AS build

WORKDIR /app

RUN corepack enable

COPY package.json ./package.json
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY tsconfig.base.json ./tsconfig.base.json
COPY tsconfig.node.json ./tsconfig.node.json
COPY tsconfig.bundler.json ./tsconfig.bundler.json

COPY global-shared ./global-shared

COPY .env.shared ./.env.shared
COPY .env.production ./.env.production

COPY server/package.json ./server/package.json
COPY server/nest-cli.json ./server/nest-cli.json
COPY server/tsconfig.json ./server/tsconfig.json
COPY server/src ./server/src

RUN pnpm install --frozen-lockfile --filter ./global-shared --filter ./server...

WORKDIR /app/global-shared

RUN pnpm run build

WORKDIR /app/server

RUN pnpm run build

FROM node:24.14.0

WORKDIR /app

RUN corepack enable

ARG SERVER_PORT=43107
ENV NODE_ENV=production
ENV SERVER_PORT=${SERVER_PORT}

COPY package.json ./package.json
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY tsconfig.base.json ./tsconfig.base.json
COPY tsconfig.node.json ./tsconfig.node.json

COPY global-shared ./global-shared

COPY .env.shared ./.env.shared
COPY .env.production ./.env.production

COPY server/package.json ./server/package.json
COPY server/nest-cli.json ./server/nest-cli.json

RUN pnpm install --frozen-lockfile --prod --filter ./global-shared --filter ./server...

WORKDIR /app/server

COPY --from=build /app/global-shared/dist /app/global-shared/dist
COPY --from=build /app/server/build ./build

EXPOSE ${SERVER_PORT}

CMD ["node", "./build/main.js"]
