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
  fotos: [],
  pujas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Puja",
    },
  ],
  emailComprador: { type: String, default: null },
});

const productoModel = mongoose.model("Producto", productoSchema);
module.exports = productoModel;
