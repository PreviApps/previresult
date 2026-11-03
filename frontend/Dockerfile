# ---- Build Stage ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Copiamos el build de vite al directorio que sirve nginx
COPY --from=build /app/dist /usr/share/nginx/html

# (Opcional) Si necesitas customizar la config de nginx para rutas de SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]