FROM --platform=linux/amd64 node:16.20.0

RUN mkdir types

COPY types types

RUN mkdir server

COPY server/ server

WORKDIR /server

RUN npm install

RUN npm run build

ENV PORT $SERVER_PORT

EXPOSE $SERVER_PORT

CMD [ "npm", "run", "server-run" ]