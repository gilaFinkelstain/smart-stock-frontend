# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for cache efficiency
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest and build
COPY . .
ARG VITE_API_URL="http://localhost:5000"
ARG VITE_DEV_PORT=3000
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_DEV_PORT=${VITE_DEV_PORT}
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy built SPA
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
