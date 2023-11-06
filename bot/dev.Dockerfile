FROM node:12.20.2-alpine3.10

WORKDIR /app

COPY . /app

EXPOSE 8083

CMD ["yarn", "dev"]
