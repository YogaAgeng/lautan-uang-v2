const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  // Memuat variabel dari .env sebelum test suite berjalan
  // sehingga DATABASE_URL dan JWT_SECRET tersedia di process.env
  setupFiles: ["dotenv/config"],
  transform: {
    ...tsJestTransformCfg,
  },
};