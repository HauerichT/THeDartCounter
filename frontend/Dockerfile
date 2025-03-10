# Verwenden Sie ein neueres Node.js-Image mit einer Version >= 17 (empfohlen: 18)
FROM node:18 AS builder

# Setzen Sie das Arbeitsverzeichnis
WORKDIR /app

# Kopieren Sie die package.json und package-lock.json
COPY package*.json ./

# Installieren Sie die Abhängigkeiten
RUN npm install

# Kopieren Sie den Rest der Dateien
COPY . .

# Bauen Sie das Frontend
RUN npm run build

# Verwenden Sie ein leichtgewichtiges Image für die Auslieferung (z.B. Nginx)
FROM nginx:alpine

# Kopieren Sie die erstellten Dateien ins Nginx-HTML-Verzeichnis
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponieren Sie den Standardport 80
EXPOSE 80

# Starten Sie den Nginx-Server
CMD ["nginx", "-g", "daemon off;"]