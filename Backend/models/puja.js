const mongoose = require('mongoose');

const pujaSchema = new mongoose.Schema({
    precio :  Number ,
    emailPujador : String, 
    idProducto: Number 
});

const pujaModel = mongoose.model("Pujas",pujaSchema);
module.exports = pujaModel;