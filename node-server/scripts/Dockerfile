# Dockerfile pm2 + Alpine
FROM keymetrics/pm2:8-alpine
# Create app directory
WORKDIR /app
# Install app dependencies
COPY ./package.json ./yarn.lock ./
RUN yarn install --production
# Copy app bundle files
COPY ./lib/ ./lib/
COPY ./build/ ./build/
# Copy PM2 configuration file
COPY ./pm2.config.js ./
# Copy enviroment configuration files
COPY ./config/env.js ./config/paths.js ./config/
COPY ./.env* ./
EXPOSE 3000
# defined in package.json
CMD [ "yarn", "start" ]