# Étape 1 : build
FROM node:20-alpine AS build 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# adapte la commande build à ton projet (vite, react, webpack, etc.)
RUN npm run build

# Étape 2 : serve statique
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
