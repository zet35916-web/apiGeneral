const express = require('express');
const router = express.Router();
const verificarToken = require('../../auth-module/middleware/verificarToken');
const configController = require('../controllers/configController');

router.post('/guardar', verificarToken, configController.guardar);
router.get('/actual', verificarToken, configController.obtenerActual);
router.get('/anterior', verificarToken, configController.obtenerAnterior);

module.exports = router;