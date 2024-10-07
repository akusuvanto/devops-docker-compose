FROM node:22

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8199
CMD ["node", "app.mjs"]
