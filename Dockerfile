# Step 1: Use Node.js base image
FROM node:21 as builder

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Step 5: Copy the source code
COPY . .

# Step 6: Build the TypeScript code
RUN npm run build

# Step 7: Use a smaller image for running the application
FROM node:21-slim

WORKDIR /usr/src/app

# Copy built application from the builder
COPY --from=builder /usr/src/app .

# Step 8: Expose the application port
EXPOSE 8080

# Step 9: Command to start the application
CMD ["npm", "start"]
