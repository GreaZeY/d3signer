FROM node:14.14.0-alpine as builder
WORKDIR /app
COPY ./package.json ./
RUN npm i -f
COPY . .
RUN npm run build

EXPOSE 3000
CMD npm run start

