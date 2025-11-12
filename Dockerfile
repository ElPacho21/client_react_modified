# Docker desarrollo
FROM node:22-bullseye

ENV AUTH_SERVICE_URL=http://host.docker.internal:3000/
ENV CART_SERVICE_URL=http://host.docker.internal:3003/
ENV CATALOG_SERVICE_URL=http://host.docker.internal:3002/
ENV IMAGE_SERVICE_URL=http://host.docker.internal:3001/
ENV ORDER_SERVICE_URL=http://host.docker.internal:3004/

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

COPY . ./

# Puerto cliente api
EXPOSE 4200

CMD ["npm", "start"]
