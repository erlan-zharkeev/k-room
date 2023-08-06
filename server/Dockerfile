FROM --platform=linux/amd64 node:14.20.1

RUN mkdir types

COPY types types

RUN mkdir server

COPY server/ server

WORKDIR /server

RUN yarn

RUN yarn build

ENV PORT $SERVER_PORT

EXPOSE $SERVER_PORT

CMD [ "yarn", "server-run" ]