FROM --platform=linux/amd64 node:24.14.0

RUN npm install -g pnpm

RUN mkdir types

COPY types types
COPY .env.development /.env.development
COPY .env.production /.env.production

RUN mkdir client

COPY client/ client

WORKDIR /client

RUN pnpm install

RUN pnpm run build

ENV PORT $CLIENT_PORT

EXPOSE $CLIENT_PORT

CMD [ "pnpm", "run", "serve:build"]
