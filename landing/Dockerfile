FROM node:14-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
ENV HOST=0.0.0.0
ENV PORT=8080

USER node

COPY --chown=node:node . ./

RUN npm install
RUN npm run create-env
RUN npm run build
EXPOSE 9000 8080

ENTRYPOINT ["npm", "run", "start"]