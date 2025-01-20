# Use the Node.js image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install the necessary build tools and Python
RUN apt-get update && apt-get install -y build-essential python3

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000
