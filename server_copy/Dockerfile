FROM --platform=linux/amd64 node:18.13.0

RUN npm install -g pnpm

RUN mkdir types

COPY types types

RUN mkdir server

COPY server/ server

WORKDIR /server

RUN pnpm install

RUN pnpm run build

ENV PORT $SERVER_PORT

EXPOSE $SERVER_PORT

CMD [ "pnpm", "run", "server-run" ]