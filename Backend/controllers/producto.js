const Producto = require("../models/producto");

const getAllProducts = async (req, res) => {
  const products = await Producto.find();
  res.json(products);
};

const createProduct = async (req, res) => {
  const { titulo, precio, email } = req.body;
  if (!titulo || !precio || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newProduct = await Producto.create({
    titulo,
    precio,
    email,
  });
  res.status(201).json(newProduct);
};

module.exports = { getAllProducts, createProduct };
