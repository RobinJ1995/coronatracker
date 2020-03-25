FROM node:13 AS build

COPY . /app
WORKDIR /app

RUN npm install && \
    npm run build && \
    rm -rf node_modules

FROM nginx:stable

COPY --from=build /app/build/ /var/www/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf