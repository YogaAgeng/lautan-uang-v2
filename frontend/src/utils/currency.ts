/**
 * utils/currency.ts
 * Utilitas terpusat untuk menangani nilai moneter dari API backend.
 *
 * KONTEKS:
 * Backend menyimpan targetAmount & currentAmount sebagai PostgreSQL BIGINT.
 * Prisma v7 men-serialize tipe BigInt menjadi STRING saat dikembalikan via JSON
 * (karena JSON standar tidak mendukung integer >2^53).
 *
 * RISIKO TANPA UTILITAS INI:
 * - "50000000" + 10000 = "5000000010000" (string concatenation, bukan penjumlahan!)
 * - progress = "300000" / "1000000" = NaN
 * - Tampilan progress bar selalu 0% atau error
 */

/**
 * Konversi nilai moneter dari API (string BigInt) ke Number JavaScript.
 * Aman untuk kalkulasi progress bar, perbandingan, dan tampilan UI.
 *
 * @param value - String dari API ("50000000"), number, atau undefined/null
 * @returns number yang aman untuk operasi matematika
 *
 * @example
 * toNumber("50000000")         // → 50000000
 * toNumber(50000000)           // → 50000000 (number langsung)
 * toNumber("50000000.50")      // → 50000000.5
 * toNumber(null)               // → 0
 * toNumber(undefined)          // → 0
 * toNumber("invalid")          // → 0
 */
export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

/**
 * Hitung persentase funding sebuah kampanye.
 * Input bisa berupa string (dari API) atau number.
 *
 * @returns Angka 0–100, dibulatkan ke integer
 *
 * @example
 * fundingPercent("300000", "1000000")  // → 30
 * fundingPercent(1000000, 1000000)     // → 100
 * fundingPercent("500000", "0")        // → 0 (hindari division by zero)
 */
export function fundingPercent(
  currentAmount: string | number,
  targetAmount: string | number
): number {
  const current = toNumber(currentAmount);
  const target  = toNumber(targetAmount);
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Format nilai Rupiah untuk tampilan UI.
 * Menggunakan Intl.NumberFormat standar Indonesia.
 *
 * @example
 * formatRupiah("50000000")  // → "Rp 50.000.000"
 * formatRupiah(1500000)     // → "Rp 1.500.000"
 */
export function formatRupiah(value: string | number | null | undefined): string {
  const n = toNumber(value);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
