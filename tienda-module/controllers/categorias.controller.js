const categoriasService = require('../services/categorias.service');

// GET /categorias
async function listar(req, res) {
  try {
    const categorias = await categoriasService.listarCategorias();
    res.json(categorias);
  } catch (err) {
    console.error('[tienda-module] Error en GET /categorias:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
}

module.exports = { listar };
