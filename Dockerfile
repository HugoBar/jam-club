# Use the Node.js image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install the necessary build tools and Python
RUN apt-get update && apt-get install -y build-essential python3

# Accept build arguments for secrets
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_PORT

# Set secrets as environment variables within the container
ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_PORT=$DB_PORT

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on
EXPOSE 8080

CMD ["npm", "start"]
