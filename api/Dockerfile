FROM node:14-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN apk add --no-cache python3 python3-dev

WORKDIR /home/node/app

USER node

COPY package.json ./
COPY --chown=node:node . .

RUN npm install
RUN npm create-env
EXPOSE 3000

CMD ["npm", "run", "dev"]