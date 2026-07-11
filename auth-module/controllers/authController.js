const authService = require('../services/authService');

function manejarError(err, res) {
  const status = err.status || 500;
  const mensaje = status === 500 ? 'Error inesperado' : err.message;
  if (status === 500) console.error(err);
  res.status(status).json({ error: mensaje });
}

async function register(req, res) {
  try {
    const { email, password, nombre } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son obligatorios' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'password debe tener al menos 8 caracteres' });
    }
    const resultado = await authService.registrar({ email, password, nombre });
    res.status(201).json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son obligatorios' });
    }
    const resultado = await authService.login({ email, password });
    res.json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

async function refresh(req, res) {
  try {
    const resultado = await authService.refrescar({ usuario_id: req.usuario_id });
    res.json(resultado);
  } catch (err) {
    manejarError(err, res);
  }
}

async function me(req, res) {
  try {
    const perfil = await authService.obtenerPerfil({ usuario_id: req.usuario_id });
    res.json(perfil);
  } catch (err) {
    manejarError(err, res);
  }
}

module.exports = { register, login, refresh, me };