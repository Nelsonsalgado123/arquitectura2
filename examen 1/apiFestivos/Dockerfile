FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=3030
ENV DB_HOST=dockerbdfestivos
ENV DB_PORT=27017
ENV DB_NAME=festivos_db

EXPOSE 3030

CMD ["node", "index.js"]
