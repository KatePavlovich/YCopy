FROM node:carbon

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY src /app

EXPOSE 8001
CMD [ "node", "server.js" ]