# ETAPA 1: Construcción con Vite
FROM node:20-alpine AS build

WORKDIR /app

# URL de la API del backend; se inyecta en el build (ver docker-compose.yml)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copiamos dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y compilamos con Vite
COPY . .
RUN npm run build


# ETAPA 2: Servidor web de producción
FROM nginx:alpine

# ¡Esta es la línea clave para React Router! Evita el error 404 al recargar rutas.
# Ademas, el bloque location /api/ hace proxy same-origin hacia el backend:
# el navegador habla con el mismo origen (frontend) y nginx reenvia a backend:3000.
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } location /api/ { proxy_pass http://backend:3000; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; } }' > /etc/nginx/conf.d/default.conf

# Pasamos los archivos compilados de la carpeta "dist" hacia Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]
