const router = require('express').Router();
const categoriasController = require('../controllers/categorias.controller');

router.get('/', categoriasController.listar);

module.exports = router;
