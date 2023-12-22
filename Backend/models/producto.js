const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  emailVendedor: String /*idVendedor : Number*/,
  direccion: String,
  titulo: String,
  descripcion: String,
  fechaInicio: { type: Date, default: null },
  fechaFin: { type: Date, default: null },
  enSubasta: { type: Boolean, default: false },
  pujaMayor: { type: Number, default: 0 },
  precioInicio: Number,
  fotos: {
    type: [String], // Esto indica que el campo fotos es un array de strings
    default: [],     // Esto establece un valor predeterminado como un array vacío
  }  ,
  emailComprador: { type: String, default: null },
  valoradoPorComprador: {type: Boolean, default: false},
  valoradoPorVendedor: {type: Boolean, default: false},
  pagado: {type: Boolean, default: false},
});

const productoModel = mongoose.model("Producto", productoSchema);
module.exports = productoModel;
