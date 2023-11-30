# frontend/Dockerfile
FROM node:14-alpine

WORKDIR /usr/src/app

# Copia los archivos de configuración de npm
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

EXPOSE 3000

CMD npm start
