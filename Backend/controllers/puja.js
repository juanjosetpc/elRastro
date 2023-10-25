const Puja = require("../models/puja");

const getAllPujas = async (req, res) => {
  try {
    const pujas = await Puja.find();
    res.json(pujas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function createPuja(req, res) {
  try {
    const nuevaPuja = await Puja.createPuja(req.body);
    res.json(nuevaPuja);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllPujas, createPuja };
