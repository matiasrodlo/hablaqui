FROM node:14-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY package.json ./
COPY --chown=node:node . .

RUN npm install
RUN npm create-env
EXPOSE 80

CMD ["npm", "run", "dev"]