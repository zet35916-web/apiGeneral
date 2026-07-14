const router = require('express').Router();
const configuracionController = require('../controllers/configuracion.controller');

router.get('/', configuracionController.obtener);

module.exports = router;
