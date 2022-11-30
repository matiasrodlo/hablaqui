FROM node:14-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN apk add --no-cache tzdata
ENV TZ=America/Santiago
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG API_ABSOLUTE
ARG FRONTEND_URL
ARG MERCADOPAGO_KEY
ARG VUE_APP_LANDING
ARG VUE_APP_URL

RUN export API_ABSOLUTE=$API_ABSOLUTE
RUN export FRONTEND_URL=$FRONTEND_URL
RUN export MERCADOPAGO_KEY=$MERCADOPAGO_KEY
RUN export VUE_APP_LANDING=$VUE_APP_LANDING
RUN export VUE_APP_URL=$VUE_APP_URL

WORKDIR /home/node/app
USER node

COPY --chown=node:node . ./

RUN npm install

ENV HOST=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production

RUN npm run create-env
RUN npm run generate
EXPOSE 9000 8080

ENTRYPOINT ["npm", "run", "start"]