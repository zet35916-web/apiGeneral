const pool = require('../db/pool');

async function listarCategorias() {
  const { rows } = await pool.query(
    'SELECT * FROM tienda.categorias ORDER BY nombre ASC'
  );
  return rows;
}

module.exports = { listarCategorias };
