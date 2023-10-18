const mongoose = require('mongoose');

const pujaSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
});

const pujaModel = mongoose.model("Puja",pujaSchema);
module.exports = pujaModel;