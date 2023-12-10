const Conversacion = require('../models/conversacion');
const colors = require('picocolors');
const Producto = require('../models/producto');

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

const closeConversation = async () => {
  try {
    // Obtener todas las conversaciones abiertas
    const conversacionesAbiertas = await Conversacion.find({ abierta: true });    
    // Iterar sobre cada conversación y cerrarla si el tiempo de puja ha terminado
    for (const conversacion of conversacionesAbiertas) {
      // Buscar el producto asociado a la conversación por su título
      
      const producto = await Producto.findOne({ titulo: conversacion.producto, fechaFin: { $lte: new Date() } });
      
      if (producto) {
        // Actualizar la conversación a cerrada
        await Conversacion.findByIdAndUpdate(
          conversacion._id,
          { abierta: false },
          { new: true }
        );

        console.log(colors.blue(`Conversación cerrada: ${conversacion._id}`));
      }
    }

    console.log('Conversaciones cerradas');
  } catch (error) {
    console.log(colors.red("Error al cerrar conversaciones. " + error.message));
  }
};


module.exports = {
  getAllConversations,
  createConversation,
  updateConversation,
  closeConversation
};
