# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# BLINDSPOT DEFENSE: Kopi package.json dulu, baru jalankan npm install.
# Ini memanfaatkan Docker Layer Caching. Jika source code berubah tapi dependencies tidak,
# Docker tidak akan menjalankan ulang npm install.
COPY package*.json ./
RUN npm install

# Kopi sisa source code dan lakukan kompilasi TypeScript
COPY . .
RUN npx tsc

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app

# Hanya install production dependencies agar image ringan
COPY package*.json ./
RUN npm install --omit=dev

# Kopi hasil build dari stage builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]