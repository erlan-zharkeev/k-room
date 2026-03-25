FROM --platform=linux/amd64 node:24.14.0

RUN mkdir common

COPY common common
COPY .env.development /.env.development
COPY .env.production /.env.production

RUN mkdir server

COPY server/ server

WORKDIR /server

RUN npm ci

RUN npm run build

ENV PORT $SERVER_PORT

EXPOSE $SERVER_PORT

CMD [ "npm", "run", "server-run" ]
