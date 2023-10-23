
const puja = require('../models/puja');

async function listPuja(req, res) {
    try {
      const pujas = await puja.find();
      res.json(pujas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
async function createPuja(req, res) {
    try {
      const nuevaPuja = new puja(req.body);
      await nuevaPuja.save();
      res.json(nuevaPuja);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

module.exports = {listPuja, createPuja};