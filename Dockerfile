FROM node:22.6.0-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./.
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

### Run apache server ###
FROM httpd:alpine
RUN rm -r /usr/local/apache2/htdocs/*
COPY --from=builder /usr/src/app/dist/ /usr/local/apache2/htdocs/
COPY ./httpd.conf /usr/local/apache2/conf/