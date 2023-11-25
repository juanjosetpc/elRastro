const Conversacion = require('../models/conversacion');
const colors = require('picocolors');

const getAllConversations = async (req, res) => {
  try {
    const conversaciones = await Conversacion.find();
    if (!conversaciones || conversaciones.length === 0) {
      console.log(colors.yellow('No se encontraron conversaciones'));
      return res.status(404).json({ error: 'No se encontraron conversaciones' });
    }
    console.log(colors.blue('Se han obtenido las conversaciones'));
    
    res.json(conversaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las conversaciones' });
  }
};

const createConversation = async (req, res) => {
  try {
    const { vendedor, comprador, producto } = req.body;

    // Comprobar si ya existe una conversación con los mismos participantes
    const conversacionExistente = await Conversacion.findOne({
      vendedor: vendedor,
      comprador: comprador,
      producto: producto
    });

    if (conversacionExistente) {
      console.log(colors.yellow(`La conversación ya existe para ${vendedor} y ${comprador} sobre ${producto}`));

      return res.status(201).json({conversacionExistente});
    } else {
      // Si la conversación no existe, créala y agrégala a la lista de nuevas conversaciones
      const conversacionExistente = await Conversacion.create({ vendedor, comprador,abierta: true, producto, mensajes: []  });
      console.log(colors.blue(`Nueva conversación creada: ${conversacionExistente}`));
      res.status(201).json({ conversacionExistente });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al crear las conversaciones' });
  }
};

const updateConversation = async (req, res) => {
  const { vendedor, comprador, producto } = req.params;
  const { emisor, receptor, fecha, contenido } = req.body;

  try {
    const conversacion = await Conversacion.findOneAndUpdate(
      { vendedor, comprador, producto },
      {
        $push: {
          mensajes: {
            emisor,
            receptor,
            fecha,
            contenido,
          },
        },
      },
      { new: true }
    );

    if (!conversacion) {
      console.log(colors.yellow('No se encontró la conversación para actualizar'));
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    console.log(colors.blue(`Conversación actualizada entre ${vendedor} y ${comprador}`));
    res.status(200).json({ mensaje: 'Conversación actualizada', conversacion });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar la conversación. Error msg: ' + error.message,
    });
  }
};

const closeConversation = async (req, res) => {
    const { vendedor, comprador,producto } = req.params;
  
    try {
      const conversacion = await Conversacion.findOneAndUpdate(
        { vendedor, comprador, producto },
        { abierto: false },
        { new: true }
      );
  
      if (!conversacion) {
        console.log(colors.yellow('No se encontró la conversación para cerrar'));
        return res.status(404).json({ error: 'Conversación no encontrada' });
      }
  
      console.log(colors.blue(`Conversación cerrada entre ${vendedor} y ${comprador}`));
      res.status(200).json({ mensaje: 'Conversación cerrada', conversacion });
    } catch (error) {
      res.status(500).json({
        error: 'Error al cerrar la conversación. Error msg: ' + error.message,
      });
    }
  };

module.exports = {
  getAllConversations,
  createConversation,
  updateConversation,
  closeConversation
};
