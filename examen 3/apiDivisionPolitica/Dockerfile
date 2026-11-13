# Imagen base de Node.js
FROM node:latest

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el código fuente de la aplicación
COPY . .

# Variables de entorno por defecto para la red Docker
ENV PORT=3030
ENV DB_HOST=dockerbddivisionpolitica
ENV DB_PORT=27017
ENV DB_NAME=divisionpolitica

# Exponer el puerto interno de Express
EXPOSE 3030

# Punto de entrada real del proyecto (server.js llama a app.escuchar())
CMD ["node", "server.js"]
