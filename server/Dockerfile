FROM node:20-alpine

WORKDIR /app
COPY . .

WORKDIR /app/src
RUN npm install

EXPOSE 3000
CMD ["node", "app.js"]