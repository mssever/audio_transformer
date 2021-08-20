# syntax=docker/dockerfile:1

FROM node:14.17.5-alpine

WORKDIR /app

RUN apk update && apk --no-cache --update add python3 build-base 

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
