const Producto = require("../models/producto");

const getAllProducts = async (req, res) => {
  const products = await Producto.find();
  res.json(products);
};

const createProduct = async (req, res) => {
  const { producto, precio, email } = req.body;
  if (!producto || !precio || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newProduct = await Producto.create({
    producto,
    precio,
    email,
  });
  res.status(201).json(newProduct);
};

module.exports = { getAllProducts, createProduct };
