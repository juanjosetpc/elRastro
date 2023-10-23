const mongoose = require('mongoose');

const pujaSchema = new mongoose.Schema({
    precio: {
        type: Number,
        required: true,
    },
});

const pujaModel = mongoose.model("Pujas",pujaSchema);
module.exports = pujaModel;