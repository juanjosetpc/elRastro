const express = require('express');
const router = express.Router();

const {listProducto,createProducto } = require('../controllers/producto');
const {listPuja,createPuja} = require('../controllers/puja');

router.get('/productos', listProducto); // listar productos
router.post('/productos', createProducto); // crear nuevo producto

router.get('/pujas', listPuja); // listar pujas
router.post('/pujas', createPuja); // crear nueva puja


module.exports = router;
