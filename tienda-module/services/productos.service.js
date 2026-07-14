const pool = require('../db/pool');

// Construye y ejecuta el listado de productos con filtros dinámicos.
// Recibe los query params tal cual llegan del controller (strings) y
// devuelve { productos, total }.
async function listarProductos(filtros = {}) {
  const {
    categoria_id,
    destacado,
    disponible,
    precio_min,
    precio_max,
    orden,
    excluir_id,
    limit,
    offset,
  } = filtros;

  const condiciones = [];
  const valores = [];
  let i = 1;

  if (categoria_id) {
    condiciones.push(`categoria_id = $${i++}`);
    valores.push(categoria_id);
  }
  if (destacado === 'true') {
    condiciones.push(`destacado = true`);
  }
  if (disponible === 'true') {
    condiciones.push(`stock > 0`);
  }
  if (precio_min) {
    condiciones.push(`precio >= $${i++}`);
    valores.push(precio_min);
  }
  if (precio_max) {
    condiciones.push(`precio <= $${i++}`);
    valores.push(precio_max);
  }
  if (excluir_id) {
    condiciones.push(`id != $${i++}`);
    valores.push(excluir_id);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  let orderBy = 'ORDER BY creado_en DESC'; // relevancia (default) y recientes usan lo mismo por simplicidad
  if (orden === 'precio_asc') orderBy = 'ORDER BY precio ASC';
  if (orden === 'precio_desc') orderBy = 'ORDER BY precio DESC';

  const lim = Math.min(parseInt(limit, 10) || 20, 100);
  const off = parseInt(offset, 10) || 0;

  const totalResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM tienda.productos ${where}`,
    valores
  );

  const valoresConPaginacion = [...valores, lim, off];
  const dataResult = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre FROM tienda.productos p
 LEFT JOIN tienda.categorias c ON p.categoria_id = c.id
 ${where} ${orderBy} LIMIT $${i++} OFFSET $${i++}`,
    valoresConPaginacion
  );

  return {
    productos: dataResult.rows,
    total: totalResult.rows[0].total,
  };
}

async function obtenerProductoPorId(id) {
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre FROM tienda.productos p
 LEFT JOIN tienda.categorias c ON p.categoria_id = c.id
 WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { listarProductos, obtenerProductoPorId };