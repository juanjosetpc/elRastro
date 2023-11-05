const Puja = require("../models/puja");
const Producto = require("../models/producto");
const color = require("picocolors");

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

const getPuja = async (req, res) => {
  const id = req.params.id;
  try {
    const puja = await Puja.findById(id);
    if (!puja) {
      return res.status(404).json({ error: "Puja no encontrado" });
    }
    res.json(puja);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la puja" });
  }
};

const createPuja = async (req, res) => {
  try {
      let puja = req.body;
      const pujaMayor = await Puja.find({ producto: puja.producto }).sort({ cantidad: "desc" }).limit(1).exec();
      const producto = await Producto.findById(puja.producto);

      if ( (pujaMayor.length == 0 && (puja.cantidad >= producto.precioInicio)) || (pujaMayor.length > 0 && puja.cantidad > pujaMayor[0].cantidad) ){
        // Comprobar si ya existe una puja con los mismos datos
        const pujaExistente = await Puja.findOne({
          producto: puja.producto,
          cantidad: puja.cantidad,
          emailPujador: puja.emailPujador,
        });

        if (pujaExistente) {
          // Si la puja ya existe, puedes omitirla o manejarla según tus necesidades
          console.log(color.blue(`La puja ya existe: ${pujaExistente.titulo}`));
        } else {
          // Si la puja no existe, créala y agrégala a la lista de nuevas pujas
          puja.emailVendedor = producto.emailVendedor;
          const nuevaPuja = await Puja.create(puja);

          console.log(color.blue(`Nueva puja creada: ${nuevaPuja}`));
          res.status(201).json({ nuevaPuja});
        }
      } else {
        if(puja.cantidad < producto.precioInicio){
          console.log(color.yellow("No se ha podido crear la puja, la puja ha de ser más alta que el precio de inicio"));
          return res.status(400).json({error: `La puja ha de ser más alta que el precio de inicio: ${producto.precioInicio}`});
        }
        if(pujaMayor.length > 0 && puja.cantidad <= pujaMayor[0].cantidad){
          console.log(color.yellow("No se ha podido crear la puja, ya habia una mayor"));
          return res.status(400).json({error: `La puja ha de ser más alta que la actual: ${pujaMayor[0].cantidad}`});
        }
      }

  } catch (error) {
    console.log(color.red("Error al crear las pujas " + error.message));
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

/*
  Dado el email del pujador obtiene el email del vendedor del producto donde el pujador ha realizado la puja mas alta
  y con ese email busca todos los objetos que esta vendiendo actualmente ese vendedor.
*/
const getPujasByVendedorDescByPrice = async (req, res) => {
  const pujador = req.params.email;
  try {
    const producto = await Puja.findOne({ emailPujador: pujador }).sort({
      cantidad: "desc",
    });
    const productos = await getProductsByVendedor(producto);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      error:
        "Error al obtener los productos. Mensaje de error: " + error.message,
    });
  }
};

const getProductsByVendedor = async (producto) => {
  const vendedor = producto.emailVendedor;

  try {
    if (producto) {
      // Realiza una consulta para encontrar productos del vendedor dado
      const productos = await Producto.find({
        enSubasta: true, // Solo productos en subasta
        emailVendedor: vendedor,
      });

      return productos;
    } else {
      return [];
    }
  } catch (error) {
    res.status(500).json({
      error:
        "Error al buscar productos en subasta. Mensaje de error: " +
        error.message,
    });
  }
};

const getTodasPujasAMisProductos = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  try {
    const pujas = await Puja.find({ emailVendedor: idUsuario });
    if (!pujas || pujas.length === 0) {
      return res.status(404).json({ error: "No se encontraron pujas" });
    }
    res.json(pujas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pujas" });
  }
};

const getpujasMayoresQueUnValor = async (req, res) => {
  const valor = req.params.valor;
  try {
    const pujas = await Puja.find({ cantidad: { $gt: valor } });
    if (!pujas || pujas.length === 0) {
      return res.status(404).json({ error: "No se encontraron pujas" });
    }
    res.json(pujas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pujas" });
  }
};

const getpujasEnOrdenAlfabeticoDelUsuario = async (req, res) => {
  try {
    const pujasS = await Puja.find().sort({emailPujador: 1});
    if (!pujasS || pujasS.length === 0) {
      return res.status(404).json({ error: "No se encontraron pujas" });
    }
    res.json(pujasS);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pujas en orden" });
  }
};

module.exports = {
  getAllPujas,
  createPuja,
  updatePuja,
  deletePuja,
  getPujasByVendedorDescByPrice,
  getTodasPujasAMisProductos,
  getPuja,
  getpujasMayoresQueUnValor,
  getpujasEnOrdenAlfabeticoDelUsuario
};
