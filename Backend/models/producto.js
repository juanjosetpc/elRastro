const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  emailVendedor: String, /*idVendedor : Number*/ 
  titulo: String,
  descripcion: String,
  fechaInicio : Date,
  fechaFin : Date ,
  enSubasta : Boolean ,
  pujaMayor: Number,
  precioInicio: Number 
  
});

const productoModel = mongoose.model("Producto", productoSchema);
module.exports = productoModel;
