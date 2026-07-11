const pool = require('../db/pool');

// Guardado manual: rota lo que hoy es "actual" (version=0) a
// "anterior" (version=1), y escribe el contenido nuevo como "actual".
// Todo en una sola transacción.
async function guardar({ usuarioId, contenido }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO sync.respaldos (usuario_id, version, contenido, guardado_en)
       SELECT usuario_id, 1, contenido, guardado_en
       FROM sync.respaldos
       WHERE usuario_id = $1 AND version = 0
       ON CONFLICT (usuario_id, version) DO UPDATE SET
           contenido   = EXCLUDED.contenido,
           guardado_en = EXCLUDED.guardado_en`,
      [usuarioId]
    );

    const { rows } = await client.query(
      `INSERT INTO sync.respaldos (usuario_id, version, contenido, guardado_en)
       VALUES ($1, 0, $2::jsonb, now())
       ON CONFLICT (usuario_id, version) DO UPDATE SET
           contenido   = EXCLUDED.contenido,
           guardado_en = now()
       RETURNING contenido, guardado_en`,
      [usuarioId, JSON.stringify(contenido)]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function obtenerVersion({ usuarioId, version }) {
  const { rows } = await pool.query(
    'SELECT contenido, guardado_en FROM sync.respaldos WHERE usuario_id = $1 AND version = $2',
    [usuarioId, version]
  );
  return rows[0] || null;
}

module.exports = {
  guardar,
  obtenerActual: (usuarioId) => obtenerVersion({ usuarioId, version: 0 }),
  obtenerAnterior: (usuarioId) => obtenerVersion({ usuarioId, version: 1 }),
};