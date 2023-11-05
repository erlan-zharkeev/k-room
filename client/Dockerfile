FROM --platform=linux/amd64 node:16.20.0

RUN npm install -g pnpm

RUN mkdir types

COPY types types

RUN mkdir client

COPY client/ client

WORKDIR /client

RUN pnpm install

RUN pnpm run build

ENV PORT $CLIENT_PORT

EXPOSE $CLIENT_PORT

CMD [ "pnpm", "run", "serve:build"]