# ---- Base Node ----
# carbon: node 8 lts
FROM node:carbon AS base
# Create app directory
WORKDIR /app

# ---- node server build ----
FROM base AS node-build  
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY .env* .eslint* ./
COPY src ./src
COPY config ./config
COPY scripts ./scripts
RUN yarn run build-server

# ---- Web build ----
FROM base AS web-build  
WORKDIR /app
COPY web ./
RUN yarn install
# Build bundle static files
RUN yarn run build

# ---- Manage build ----
FROM base AS mobile-build  
WORKDIR /app
COPY mobile ./
RUN yarn install
# Build bundle static files
RUN yarn run build

# ---- Manage build ----
FROM base AS manage-build  
WORKDIR /app
COPY manage ./
RUN yarn install
# Build bundle static files
RUN yarn run build

# --- Release with pm2 + Alpine ----
FROM keymetrics/pm2:8-alpine AS release  
# Create app directory
WORKDIR /app

COPY package.json yarn.lock ./
# Install app dependencies
RUN yarn install --production

# Copy node server build files
COPY --from=node-build /app/lib ./lib

# Copy web build files
COPY --from=web-build /app/build ./build

# Copy mobile build files
COPY --from=mobile-build /app/build ./build/mobile

# Copy manage build files
COPY --from=manage-build /app/build ./build/manage

# Install app dependencies
COPY ./package.json ./yarn.lock /app/
RUN yarn install --production

# Copy PM2 configuration file
COPY ./pm2.config.js /app/

# Copy enviroment configuration files
COPY ./config/env.js ./config/paths.js /app/config/
COPY ./.env* /app/

EXPOSE 3000

CMD ["yarn", "run", "start"]
