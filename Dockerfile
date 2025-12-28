# STEP 1: Build the app
FROM node:20-alpine AS build-stage

WORKDIR /app

# Take the API Key as a 'build argument'
ARG VITE_API_KEY

# Write the API Key into a .env file so Vite can see it during build
# Vite requires variables to start with "VITE_" to be accessible
RUN echo "VITE_API_KEY=${VITE_API_KEY}" > .env

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STEP 2: Serve the app using Nginx
FROM nginx:stable-alpine

# Copy the finished build from the first stage to Nginx's folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Cloud Run uses port 8080 by default
EXPOSE 8080

# Update Nginx to listen on 8080 instead of 80
RUN sed -i 's/listen\(.*\)80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
