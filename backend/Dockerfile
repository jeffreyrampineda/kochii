FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . ./

# Build Typescript
RUN npm run build

EXPOSE 3001
CMD [ "npm", "start" ]