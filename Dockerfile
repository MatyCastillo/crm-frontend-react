FROM node:20.11.1

WORKDIR /farmacia-webapp

# Instalar dependencias
COPY package.json ./
RUN npm install

# Copiar solo el código al momento de build
COPY . .

# Expone el puerto 3000 para la aplicación React
EXPOSE 3000

# Comando por defecto para iniciar la app
CMD ["npm", "start"]
