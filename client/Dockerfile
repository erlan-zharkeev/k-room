FROM node:14.20.0

RUN mkdir types

COPY types types

RUN mkdir client

COPY client/ client

WORKDIR /client

RUN yarn

RUN yarn build

# ENV PORT $CLIENT_PORT

# EXPOSE $CLIENT_PORT

ENV PORT 3001

EXPOSE 3001

CMD [ "yarn", "serve:build"]