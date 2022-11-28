FROM node

WORKDIR /app

COPY package*.json .

RUN yarn

COPY . .

ENV PORT $PORT

EXPOSE $PORT

CMD [ "yarn", "serve"]