# 1. Build stage
FROM node:22 AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# 2. Serve stage
FROM nginx:alpine

# Copiar build a Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx si la tienes
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
