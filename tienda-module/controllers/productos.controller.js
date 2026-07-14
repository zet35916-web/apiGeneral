const productosService = require('../services/productos.service');

// GET /productos
// Query params soportados (todos opcionales):
//   categoria_id, destacado, disponible, precio_min, precio_max,
//   orden (precio_asc | precio_desc), excluir_id, limit, offset
async function listar(req, res) {
  try {
    const resultado = await productosService.listarProductos(req.query);
    res.json(resultado);
  } catch (err) {
    console.error('[tienda-module] Error en GET /productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

// GET /productos/:id
async function obtener(req, res) {
  try {
    const producto = await productosService.obtenerProductoPorId(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (err) {
    console.error('[tienda-module] Error en GET /productos/:id:', err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
}

module.exports = { listar, obtener };
