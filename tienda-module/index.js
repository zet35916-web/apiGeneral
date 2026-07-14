// Módulo independiente: Tienda de Acuarios (Río Cristal)
//
// Se acopla a tu API general igual que auth-module y sync-module:
//
//   app.use('/tienda', require('./tienda-module'));
//
// Con eso quedan disponibles:
//   GET  /tienda/productos
//   GET  /tienda/productos/:id
//   GET  /tienda/categorias
//   POST /tienda/contacto
//   GET  /tienda/configuracion
//
// Requisitos:
//   - Dependencia "pg" instalada en el proyecto raíz (npm install pg)
//   - Variable de entorno TIENDA_DATABASE_URL (o DATABASE_URL) apuntando
//     a la base donde corriste sql/schema.sql
//   - Haber ejecutado sql/schema.sql una vez contra esa base

const router = require('express').Router();

router.use('/productos', require('./routes/productos.routes'));
router.use('/categorias', require('./routes/categorias.routes'));
router.use('/contacto', require('./routes/contacto.routes'));
router.use('/configuracion', require('./routes/configuracion.routes'));

module.exports = router;
