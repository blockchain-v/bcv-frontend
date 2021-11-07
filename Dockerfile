FROM node:14

ADD . /bcv-frontend/

WORKDIR /bcv-frontend

RUN yarn install

CMD ["yarn", "serve"]
