FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

EXPOSE 7000

CMD ["npm", "start"]
