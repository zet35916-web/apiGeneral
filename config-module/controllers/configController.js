const configService = require('../services/configService');

function manejarError(err, res) {
  console.error(err);
  res.status(500).json({ error: 'Error inesperado al procesar el guardado de configuración' });
}

async function guardar(req, res) {
  try {
    const { contenido } = req.body;
    if (contenido === undefined) {
      return res.status(400).json({ error: 'El body debe incluir "contenido" en formato JSON' });
    }
    const resultado = await configService.guardar({ usuarioId: req.usuario_id, contenido });
    res.json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

async function obtenerActual(req, res) {
  try {
    const resultado = await configService.obtenerActual(req.usuario_id);
    if (!resultado) return res.status(404).json({ error: 'No hay ninguna configuración guardada todavía' });
    res.json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

async function obtenerAnterior(req, res) {
  try {
    const resultado = await configService.obtenerAnterior(req.usuario_id);
    if (!resultado) return res.status(404).json({ error: 'No hay una configuración anterior todavía' });
    res.json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

module.exports = { guardar, obtenerActual, obtenerAnterior };