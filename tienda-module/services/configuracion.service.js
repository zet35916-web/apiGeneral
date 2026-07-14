const pool = require('../db/pool');

async function obtenerConfiguracion() {
  const { rows } = await pool.query(
    'SELECT * FROM tienda.configuracion ORDER BY id ASC LIMIT 1'
  );
  return rows[0] || {};
}

module.exports = { obtenerConfiguracion };
