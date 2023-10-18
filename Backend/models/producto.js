const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    nombre: {
        type: Number,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

const productoModel = mongoose.model("Producto",productoSchema);
module.exports = productoModel;