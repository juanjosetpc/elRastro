const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    email : String,
    nombre : String,
    apellido : String,
    ciudad : String,
    calle : String,
    codigoPostal : Number,
    resenas : [{
        nota : { type: Number },
        descripcion : { type: String, maxlength: 300}
    }],
    valoracion : {
        type: Number,
        set: (v) => parseFloat(v.toFixed(2)),
        default: 0
    },
});

const usuarioModel = mongoose.model("Usuario", usuarioSchema);
module.exports = usuarioModel;