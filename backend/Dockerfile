# ---- Build Stage ----
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
# Instalamos solo dependencias de producción para mantener la imagen ligera
#RUN npm ci --only=production
RUN npm install --omit=dev

# Copiamos los archivos compilados desde la etapa de builder
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3015

CMD ["node", "dist/main"]