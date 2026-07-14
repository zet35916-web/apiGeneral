const router = require('express').Router();
const contactoController = require('../controllers/contacto.controller');

router.post('/', contactoController.crear);

module.exports = router;
