# Verwende ein Node.js-Image
FROM node:18

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere die package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den gesamten Quellcode
COPY . .

# Exponiere den Port, auf dem die API läuft
EXPOSE 8000

# Starte die Anwendung
CMD ["node", "app.js"]