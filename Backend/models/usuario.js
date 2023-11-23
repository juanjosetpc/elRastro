const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    email : String,
    ciudad : String,
    calle : String,
    codigoPostal : Number,
    resenas : [{
        nota : { type: Number },
        descripcion : { type: String}
    }],
    valoracion : Number,
});

const usuarioModel = mongoose.model("Usuario", usuarioSchema);
module.exports = usuarioModel;