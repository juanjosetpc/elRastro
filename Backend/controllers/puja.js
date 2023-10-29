const Puja = require("../models/puja");

const getAllPujas = async (req, res) => {
  try {
    const pujasS = await Puja.find();
    if (!pujasS || pujasS.length === 0) {
      return res.status(404).json({ error: "No se encontraron pujas" });
    }
    res.json(pujasS);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pujas" });
  }
};

const createPuja = async (req, res) => {
  try {
    const pujas = req.body;
    const nuevasPujas = [];

    for (const puja of pujas) {
      // Comprobar si ya existe una puja con los mismos datos
      const pujaExistente = await Puja.findOne({
        producto: puja.producto,
        cantidad: puja.cantidad,
        emailPujador: puja.emailPujador
      });

      if (pujaExistente) {
        // Si la puja ya existe, puedes omitirla o manejarla según tus necesidades
        console.log(`La puja ya existe: ${pujaExistente.titulo}`);
      } else {
        // Si la puja no existe, créala y agrégala a la lista de nuevas pujas
        const nuevaPuja = await Puja.create(puja);
        nuevasPujas.push(nuevaPuja);
      }
    }

    if (nuevasPujas.length == 0) {
      res.status(201).send("Las pujas ya estaban en la base de datos");
    } else {
      res.status(201).json({ nuevasPujas });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al crear las pujas" });
  }
};

const updatePuja = async (req, res) => {
  const id = req.params.id;
  const datosActualizar = req.body;

  try {
    const puja = await Puja.findByIdAndUpdate(id, datosActualizar, {
      new: true,
    });

    if (!puja) {
      return res.status(404).json({ error: "Puja no encontrado" });
    }

    res.status(200).json({ mensaje: "Puja actualizado", puja });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar la puja. Error msg: " + error.message,
    });
  }
};

const deletePuja = async (req, res) => {
  const id = req.params.id;
  try {
    const puja = await Puja.findByIdAndDelete(id);

    if (!puja) {
      return res.status(404).json({ error: "Puja no encontrado" });
    }
    res.status(200).json({ mensaje: "Puja eliminada correctamente" }); // Respuesta exitosa sin contenido
  } catch (error) {
    res.status(500).json({ error: "Error al intentar borrar la puja" });
  }
};






module.exports = { getAllPujas, createPuja, updatePuja, deletePuja };
