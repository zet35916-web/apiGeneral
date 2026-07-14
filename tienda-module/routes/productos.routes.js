const router = require('express').Router();
const productosController = require('../controllers/productos.controller');

router.get('/', productosController.listar);
router.get('/:id', productosController.obtener);

module.exports = router;
