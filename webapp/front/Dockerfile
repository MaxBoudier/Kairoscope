<<<<<<< Updated upstream
# Stage 1: Build the React application
FROM node:20-alpine AS builder

=======
# ==========================================
# Phase 1: Base (Common Dependencies)
# ==========================================
FROM node:20-alpine AS base
>>>>>>> Stashed changes
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

<<<<<<< Updated upstream
COPY . .

# Environment variables must be available at build time
ARG VITE_API_URL
ARG VITE_API_BASE_URL
ARG VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

=======
# ==========================================
# Phase 2: Development (Hot Reloading)
# ==========================================
FROM base AS dev
# We don't copy specific files here because they will be mounted via Volume
# But we need the node_modules from base
CMD ["npm", "run", "dev", "--", "--host"]

# ==========================================
# Phase 3: Builder (Production Compile)
# ==========================================
FROM base AS build
COPY . .
# Note: You might need to pass ENV vars here if they are baked into the build
# BUT: Vite recommends creating a .env file or passing vars during build time.
RUN npm run build

# ==========================================
# Phase 4: Production (Nginx)
# ==========================================
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
>>>>>>> Stashed changes
CMD ["nginx", "-g", "daemon off;"]
