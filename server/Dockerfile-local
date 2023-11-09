FROM node:alpine as develop-stage

WORKDIR /var/www/html

RUN apk update
RUN apk upgrade
RUN apk add bash

#RUN npm cache clean --force && rm -rf node_modules

COPY ./prisma ./prisma/

COPY .env ./

COPY ./tsconfig.json ./

COPY . .

RUN npm install

RUN npx prisma generate
RUN npx prisma migrate

