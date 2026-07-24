# 1. Usamos la imagen oficial de Node.js (versión ligera)
FROM node:20-alpine

# 2. Definimos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias y de la base de datos
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instalamos las dependencias
RUN npm install

# 5. Generamos el cliente de Prisma para conectar con PostgreSQL
RUN npx prisma generate

# 6. Copiamos todo el resto de tu código del backend
COPY . .

# 7. Ejecutamos el script de construcción de tu package.json (tsc)
RUN npm run build

# 8. Exponemos el puerto de Express
EXPOSE 3000

# 9. Comando para arrancar el servidor compilado
CMD ["npm", "start"]
