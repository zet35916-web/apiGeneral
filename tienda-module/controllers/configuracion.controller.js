const configuracionService = require('../services/configuracion.service');

// GET /configuracion
async function obtener(req, res) {
  try {
    const configuracion = await configuracionService.obtenerConfiguracion();
    res.json(configuracion);
  } catch (err) {
    console.error('[tienda-module] Error en GET /configuracion:', err);
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
}

module.exports = { obtener };
