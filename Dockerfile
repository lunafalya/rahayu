# Stage 1: Build the Vue Vite app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run dev

# Stage 2: Serve the built app with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]