const express = require('express');
const router = express.Router();

const prueba = require('../controllers/producto');

router.get('/productos', prueba);

module.exports = router;
