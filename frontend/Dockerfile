# ETAPA 1: Construcción con Vite
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y compilamos con Vite
COPY . .
RUN npm run build


# ETAPA 2: Servidor web de producción
FROM nginx:alpine

# ¡Esta es la línea clave para React Router! Evita el error 404 al recargar rutas.
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Pasamos los archivos compilados de la carpeta "dist" hacia Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]
