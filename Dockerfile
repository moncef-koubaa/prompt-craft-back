FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install --global @nestjs/cli

EXPOSE 3000

CMD ["npm", "run", "start:dev"]