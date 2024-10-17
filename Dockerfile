FROM node:18.9.0

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3030

EXPOSE 3030

CMD ["npm", "start"]
