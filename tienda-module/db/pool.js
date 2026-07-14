// Este módulo NO crea su propio pool de conexiones. Como todo vive en la
// misma base de datos, reutiliza el mismo pool que ya usan auth-module y
// sync-module — así evitas abrir 3 pools distintos contra el mismo Postgres.
//
// El aislamiento de "tienda" es solo a nivel de esquema SQL
// (tienda.productos, tienda.categorias, ...), no de conexión.
//
// Apunta directo al pool real, ubicado en auth-module/db/pool.js.
// Si alguna vez lo mueves de lugar, este es el único archivo a tocar.
module.exports = require('../../auth-module/db/pool');