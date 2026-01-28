# Étape 1 : Build
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Déclaration des arguments de build (pour Vite)
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_API_BASE_URL

# Passage des arguments en variables d'environnement
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Étape 2 : Production (Nginx)
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]