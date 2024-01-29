### STAGE 1: Build ###
FROM node:18-alpine as builder

COPY client/package.json client/package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm ci && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY /client .

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run docker:build

### STAGE 2: Setup ###
FROM node:18-alpine

## channge directory
WORKDIR /app

#COPY server code to app folder
COPY /server/ /app/

RUN npm ci

## From ‘builder’ copy published angular bundles in app/dist
COPY --from=builder /app/dist /app/dist
## expose port for express
EXPOSE 3000

CMD ["npm",  "start"]