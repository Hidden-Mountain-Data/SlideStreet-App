# Use a base image with Node.js
FROM --platform=linux/amd64 node:19.4.0 as production-stage

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY server/package*.json server/yarn.lock ./

# Install app dependencies
RUN yarn install

# Copy server code
COPY server/ .

# Build the TypeScript app
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["yarn", "start:prod"]