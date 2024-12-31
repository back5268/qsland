FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g pm2
CMD ["pm2-runtime", "start", "npm", "--", "start"]
