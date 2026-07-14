const pool = require('../db/pool');

async function crearContacto({ nombre, correo, mensaje }) {
  const { rows } = await pool.query(
    `INSERT INTO tienda.contactos (nombre, correo, mensaje)
     VALUES ($1, $2, $3)
     RETURNING id, fecha`,
    [nombre, correo, mensaje]
  );
  return rows[0];
}

module.exports = { crearContacto };
