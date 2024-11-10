# Dev dependencies
FROM node:22.8.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

USER node

# Production build
FROM node:22.8.0-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build

ENV NODE_ENV=production

RUN npm ci --only=production && npm cache clean --force

# Production
FROM node:22.8.0-alpine AS production

COPY  --from=build /usr/src/app/node_modules ./node_modules
COPY  --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]