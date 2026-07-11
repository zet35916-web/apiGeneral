const express = require('express');
const router = express.Router();
const verificarToken = require('../../auth-module/middleware/verificarToken');
const syncController = require('../controllers/syncController');

router.post('/guardar', verificarToken, syncController.guardar);
router.get('/actual', verificarToken, syncController.obtenerActual);
router.get('/anterior', verificarToken, syncController.obtenerAnterior);

module.exports = router;