# Gunakan image Node.js yang ringan
FROM node:22-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file dependensi
COPY package*.json ./

# Instal semua dependensi
RUN npm install

# Salin seluruh kode sumber
COPY . .

# Generate Prisma Client untuk environment Linux
RUN npx prisma generate

# Kompilasi TypeScript ke JavaScript murni
RUN npm run build

# Buka port (sesuaikan dengan port di server.ts Anda)
EXPOSE 3000

# Eksekusi file yang sudah dikompilasi
CMD ["npm", "start"]