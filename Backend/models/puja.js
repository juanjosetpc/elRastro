const mongoose = require("mongoose");

const pujaSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" }, // Referencia al producto al que se refiere la puja
  cantidad: Number,
  emailPujador: String,
  fechaYHora: { type: Date, default: Date.now },
});

const pujaModel = mongoose.model("Pujas", pujaSchema);
module.exports = pujaModel;
