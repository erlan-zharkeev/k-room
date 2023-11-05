FROM --platform=linux/amd64 node:16.20.0

RUN mkdir types

COPY types types

RUN mkdir client

COPY client/ client

WORKDIR /client

RUN npm install

RUN npm run build

ENV PORT $CLIENT_PORT

EXPOSE $CLIENT_PORT

CMD [ "npm", "run", "serve:build"]