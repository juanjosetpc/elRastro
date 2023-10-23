const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    precio: Number,
    email: String,
    producto: String
});

const productoModel = mongoose.model("Producto",productoSchema);
module.exports = productoModel;