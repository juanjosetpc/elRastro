
const producto = require('../models/producto');

async function listProducto(req, res) {
  try {
    const productos = await producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createProducto(req, res) {
  try {
    const nuevoProducto = new producto(req.body);
    await nuevoProducto.save();
    res.json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


  module.exports = {listProducto, createProducto};