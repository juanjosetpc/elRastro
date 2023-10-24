const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  producto: String,
  precio: Number,
  email: String,
});

const productoModel = mongoose.model("Producto", productoSchema);
module.exports = productoModel;
