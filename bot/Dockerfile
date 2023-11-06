FROM node:12.16.1-alpine as builder

WORKDIR /app

RUN apk add git openssh-client

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN --mount=type=ssh,id=github yarn

COPY ./src /app/src
COPY ./babel.config.js /app/babel.config.js

RUN yarn build

FROM node:12.16.1-alpine

ENV NODE_ENV=production

RUN apk add git openssh-client

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY ./jsconfig.json /app/jsconfig.json

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN --mount=type=ssh,id=github yarn

CMD ["yarn", "start"]