const { verificarTokenSync } = require('../services/authService');

// Middleware reusable: lo importa también sync-module (ver docs, sección 7).
// Deja disponible req.usuario_id, que es el único dato que cruza la
// frontera entre los dos módulos.
function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Falta el header Authorization: Bearer {token}' });
  }

  try {
    const payload = verificarTokenSync(token);
    req.usuario_id = payload.usuario_id;
    req.usuario_email = payload.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;