const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '90d';

if (!JWT_SECRET) {
  // Falla rápido en vez de firmar tokens con un secreto vacío/adivinable.
  throw new Error('Falta la variable de entorno JWT_SECRET');
}

function firmarToken({ usuario_id, email }) {
  return jwt.sign({ usuario_id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verificarTokenSync(token) {
  // Lanza si el token es inválido o expiró; el middleware captura el error.
  return jwt.verify(token, JWT_SECRET);
}

async function registrar({ email, password, nombre }) {
  const existente = await pool.query('SELECT id FROM auth.usuarios WHERE email = $1', [email]);
  if (existente.rows.length > 0) {
    const err = new Error('El email ya está registrado');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO auth.usuarios (email, password_hash, nombre)
     VALUES ($1, $2, $3)
     RETURNING id AS usuario_id, email, nombre`,
    [email, passwordHash, nombre || null]
  );

  const usuario = rows[0];
  const token = firmarToken({ usuario_id: usuario.usuario_id, email: usuario.email });
  return { ...usuario, token };
}

async function login({ email, password }) {
  const { rows } = await pool.query(
    'SELECT id AS usuario_id, email, nombre, password_hash FROM auth.usuarios WHERE email = $1',
    [email]
  );

  const credencialesInvalidas = () => {
    const err = new Error('Email o contraseña incorrectos');
    err.status = 401;
    throw err;
  };

  if (rows.length === 0) credencialesInvalidas();

  const usuario = rows[0];
  const passwordOk = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordOk) credencialesInvalidas();

  const token = firmarToken({ usuario_id: usuario.usuario_id, email: usuario.email });
  return { usuario_id: usuario.usuario_id, email: usuario.email, nombre: usuario.nombre, token };
}

async function refrescar({ usuario_id }) {
  // Confirma que el usuario todavía existe antes de re-firmar
  // (protege contra un token viejo de un usuario borrado manualmente en BD).
  const { rows } = await pool.query(
    'SELECT id AS usuario_id, email, nombre FROM auth.usuarios WHERE id = $1',
    [usuario_id]
  );
  if (rows.length === 0) {
    const err = new Error('El usuario ya no existe');
    err.status = 401;
    throw err;
  }
  const usuario = rows[0];
  const token = firmarToken({ usuario_id: usuario.usuario_id, email: usuario.email });
  return { token };
}

async function obtenerPerfil({ usuario_id }) {
  const { rows } = await pool.query(
    'SELECT id AS usuario_id, email, nombre FROM auth.usuarios WHERE id = $1',
    [usuario_id]
  );
  if (rows.length === 0) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return rows[0];
}

module.exports = {
  registrar,
  login,
  refrescar,
  obtenerPerfil,
  verificarTokenSync,
};