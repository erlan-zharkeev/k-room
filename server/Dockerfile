FROM --platform=linux/amd64 node:24.14.0

RUN npm install -g pnpm

RUN mkdir types

COPY types types
COPY .env.development /.env.development
COPY .env.production /.env.production

RUN mkdir server

COPY server/ server

WORKDIR /server

RUN pnpm install

RUN pnpm run build

ENV PORT $SERVER_PORT

EXPOSE $SERVER_PORT

CMD [ "pnpm", "run", "server-run" ]
