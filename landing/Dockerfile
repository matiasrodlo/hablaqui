# Establece la imagen base
FROM node:14-alpine

# Crea una carpeta con el parámetro -p, sin error si existe, crea directorios padre según sea necesario, 
# con sus modos de archivo no afectados por ninguna opción -m.  Luego le cambia la propiedad a todos los
# archivos de la carpeta /app asignandosela a node.
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Declara parámetros de la línea de comandos para el proceso de construcción
ARG API_ABSOLUTE
ARG FRONTEND_URL
ARG MERCADOPAGO_KEY
ARG VUE_APP_LANDING
ARG VUE_APP_URL

# Establece variables de entorno
RUN export API_ABSOLUTE=$API_ABSOLUTE
RUN export FRONTEND_URL=$FRONTEND_URL
RUN export MERCADOPAGO_KEY=$MERCADOPAGO_KEY
RUN export VUE_APP_LANDING=$VUE_APP_LANDING
RUN export VUE_APP_URL=$VUE_APP_URL

# 	Cambiar de directorio actual a /home/node/app
WORKDIR /home/node/app

# Cambia el usuario actual a node
USER node

# Copia todos los archivos de la carpeta actual a la carpeta /home/node/app
COPY --chown=node:node . ./

# Instala las dependencias del proyecto
RUN npm install

# Establece variables de entorno
ENV HOST=0.0.0.0
ENV PORT=9000
ENV NODE_ENV=production

# Crea el archivo .env con las variables de entorno y genera el proyecto
RUN npm run create-env
RUN npm run generate
# Expone el puerto 9000 en el contenedor
EXPOSE 9000

# Ejecuta el comando npm run start
ENTRYPOINT ["npm", "run", "start"]