# Use Node.js for building the frontend
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY client/package.json client/package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy all project files
COPY client .

# Build the project
RUN npm run build

# Use Nginx to serve the built frontend
FROM nginx:alpine

# Copy built files from Node.js build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (ensure the file exists)
COPY client/nginx.conf /etc/nginx/nginx.conf

# Expose port 5173 for the frontend
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
