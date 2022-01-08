FROM node:14-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY package.json ./
COPY nuxt.config.js ./
COPY --chown=node:node . ./

RUN npm install
RUN npm run create-env
RUN npm run generate
EXPOSE 9000 8080

ENTRYPOINT ["npm", "run", "start"]