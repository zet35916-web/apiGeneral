// Mismo pool de pg que auth-module (misma base física, un solo Pool
// para todo el proceso — no tiene sentido abrir dos pools separados
// hacia la misma base de datos).
module.exports = require('../../auth-module/db/pool');