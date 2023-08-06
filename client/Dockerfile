FROM --platform=linux/amd64 node:18.13.0

RUN mkdir types

COPY types types

RUN mkdir client

COPY client/ client

WORKDIR /client

RUN yarn

RUN yarn build

ENV PORT $CLIENT_PORT

EXPOSE $CLIENT_PORT

CMD [ "yarn", "serve:build"]