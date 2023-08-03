FROM node:14.20.1

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