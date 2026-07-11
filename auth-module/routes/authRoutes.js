const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middleware/verificarToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', verificarToken, authController.refresh);
router.get('/me', verificarToken, authController.me);

module.exports = router;