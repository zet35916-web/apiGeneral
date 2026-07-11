// Pool de conexión a PostgreSQL, compartido por auth-module y sync-module
// (ambos módulos viven en la misma base física, ver documentación de arquitectura).
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Si prefieres variables sueltas en vez de DATABASE_URL, descomenta esto:
  // host: process.env.PGHOST,
  // port: process.env.PGPORT,
  // user: process.env.PGUSER,
  // password: process.env.PGPASSWORD,
  // database: process.env.PGDATABASE,
});

pool.on('error', (err) => {
  // Error en un cliente inactivo del pool (ej. conexión perdida) — no debe tumbar el proceso.
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

module.exports = pool;