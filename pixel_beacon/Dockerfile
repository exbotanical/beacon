FROM node:alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["/bin/sh"]