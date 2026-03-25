FROM --platform=linux/amd64 node:24.14.0 AS build

RUN mkdir common

COPY common common
COPY .env.development /.env.development
COPY .env.production /.env.production

RUN mkdir client

COPY client/ client

WORKDIR /client

RUN npm ci --legacy-peer-deps

RUN npm run build

FROM nginx:stable-alpine

COPY config/nginx/client.conf /etc/nginx/conf.d/default.conf
COPY --from=build /client/build /usr/share/nginx/html

EXPOSE 80
