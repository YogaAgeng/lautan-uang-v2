Tool: Gemini 1.5 Pro

Pattern: Debugging
History prompt: "Terjadi error TS1295 saat docker compose build: ECMAScript imports and exports cannot be written in a CommonJS file."
Judgment: "Menerima saran AI untuk mengganti konfigurasi default tsconfig.json dengan penambahan esModuleInterop dan pemisahan outDir agar sesuai dengan multi-stage build Docker."

--------------------------------------------------------

Tool: Gemini 1.5 Pro
Pattern: Security & Authentication
Prompt: "Langkah setup tabel User dan Middleware JWT untuk Node.js."
Judgment: "Menggunakan pendekatan Schema-First dari Prisma (db push) untuk menambahkan entitas User secara on-the-fly tanpa merusak seed data sebelumnya. Menerapkan ekstraksi Bearer Token standar pada middleware Express."

----------------------------------------------------------------

Tugas/Masalah: Penanganan Race Condition pada transaksi investasi dan Cascading Failure pada Integration Testing.

Bantuan AI: Menghasilkan draf schema Prisma dengan Optimistic Locking (kolom version), fungsi agregasi updateMany untuk validasi baris, dan metode bypass port Docker 5433 saat terjadi bentrokan di OS Host Windows.

Modifikasi Developer (Klaim Poin Anda): Melakukan perombakan setup data di TDD menggunakan injeksi Prisma langsung (membypass HTTP) untuk mengatasi Test Pollution, memaksa eksekusi Jest secara sekuensial (--runInBand), dan menstrukturisasi ulang objek JSON response di controller agar asertasi tes berhasil.