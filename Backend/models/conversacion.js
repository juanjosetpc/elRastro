const mongoose = require('mongoose');

const conversacionSchema = new mongoose.Schema({
  vendedor: String,
  comprador: String,
  abierta: {
    type: Boolean,
    default: true,
  },
  producto: String,  
  mensajes: [{
      emisor: String,
      receptor: String,
      fecha: {
        type: Date,
        default: Date.now,
      },
      contenido: String
    }]
});

const ConversacionModel = mongoose.model('Conversacion', conversacionSchema);

module.exports = ConversacionModel;
