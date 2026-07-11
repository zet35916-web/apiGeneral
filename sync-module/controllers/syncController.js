const syncService = require('../services/syncService');

function manejarError(err, res) {
  console.error(err);
  res.status(500).json({ error: 'Error inesperado al procesar el guardado' });
}

async function guardar(req, res) {
  try {
    const { contenido } = req.body;
    if (contenido === undefined) {
      return res.status(400).json({ error: 'El body debe incluir "contenido" en formato JSON' });
    }
    const resultado = await syncService.guardar({ usuarioId: req.usuario_id, contenido });
    res.json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

async function obtenerActual(req, res) {
  try {
    const resultado = await syncService.obtenerActual(req.usuario_id);
    if (!resultado) return res.status(404).json({ error: 'No hay ningún guardado todavía' });
    res.json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

async function obtenerAnterior(req, res) {
  try {
    const resultado = await syncService.obtenerAnterior(req.usuario_id);
    if (!resultado) return res.status(404).json({ error: 'No hay un respaldo anterior todavía' });
    res.json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

module.exports = { guardar, obtenerActual, obtenerAnterior };