const contactoService = require('../services/contacto.service');
const emailService = require('../services/email.service');

// POST /contacto
// Body esperado: { nombre, correo, mensaje }
async function crear(req, res) {
  try {
    const { nombre, correo, mensaje } = req.body || {};

    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: nombre, correo y mensaje',
      });
    }

    const resultado = await contactoService.crearContacto({ nombre, correo, mensaje });

    // Lo crítico es guardar en BD (ya ocurrió arriba). Los correos son
    // "nice to have": si Gmail falla, no tumbamos la respuesta al usuario,
    // solo lo dejamos en el log.
    emailService.enviarNotificacionContacto({ nombre, correo, mensaje }).catch((err) => {
      console.error('[tienda-module] No se pudo enviar el correo de notificación al dueño:', err);
    });

    emailService.enviarConfirmacionCliente({ nombre, correo }).catch((err) => {
      console.error('[tienda-module] No se pudo enviar el correo de confirmación al cliente:', err);
    });

    res.status(201).json({ ok: true, id: resultado.id, fecha: resultado.fecha });
  } catch (err) {
    console.error('[tienda-module] Error en POST /contacto:', err);
    res.status(500).json({ error: 'Error al guardar el mensaje de contacto' });
  }
}

module.exports = { crear };