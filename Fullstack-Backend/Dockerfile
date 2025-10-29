# Use Node.js LTS
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Expose port
EXPOSE 3001

# Start backend
CMD ["node", "index.js"]
