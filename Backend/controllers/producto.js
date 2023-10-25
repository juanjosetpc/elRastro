const Producto = require("../models/producto");

const getAllProducts = async (req, res) => {
  try {
    const products = await Producto.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No se encontraron productos" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

const createProduct = async (req, res) => {
  try {
    const productos = req.body;
    const nuevosProductos = [];

    for (const producto of productos) {
      // Comprobar si ya existe un producto con los mismos datos
      const productoExistente = await Producto.findOne({
        emailVendedor: producto.emailVendedor,
        direccion: producto.direccion,
        titulo: producto.titulo,
        descripcion: producto.descripcion,
      });

      if (productoExistente) {
        // Si el producto ya existe, puedes omitirlo o manejarlo según tus necesidades
        console.log(`El producto ya existe: ${productoExistente.titulo}`);
      } else {
        // Si el producto no existe, créalo y agrégalo a la lista de nuevos productos
        const nuevoProducto = await Producto.create(producto);
        nuevosProductos.push(nuevoProducto);
      }
    }

    if (nuevosProductos.length == 0) {
      res.status(201).send("Los productos ya estaban en la base de datos");
    } else {
      res.status(201).json({ nuevosProductos });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al crear los productos" });
  }
};

const updateProduct = async (req, res) => {
  const email = req.params.email;
  const titulo = req.params.titulo;
  const datosActualizar = req.body;

  try {
    const producto = await Producto.find({
      titulo: titulo,
      emailVendedor: email,
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const nuevoProducto = await Producto.findByIdAndUpdate(
      producto._id,
      datosActualizar
    );

    res.status(200).json({ mensaje: "Producto actualizado", nuevoProducto });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar el producto. Error msg: " + error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const email = req.params.email;
  const titulo = req.params.titulo;
  try {
    const producto = await Producto.findAndDelete({
      titulo: titulo,
      emailVendedor: email,
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (error) {
    res.status(500).json({ error: "Error al intentar borrar el producto" });
  }
};
//Obtener productos ofertados por un usuario descendente por fecha de inicio
const getProductsByUserDescByDate = async (req, res) => {
  const vendedor = req.params.email;

  const productos = await Producto.find({ emailVendedor: vendedor });
  productos.sort({ fechaInicio: "desc" });

  res.json(productos);
};

//Producto en subasta a partir de (parte de ) su descripción

const getProductsByDescription = async (req, res) => {
  const descripcion = req.params.descripcion;

  try {
    // Realiza una consulta para encontrar productos en subasta que contengan la descripción parcial
    const productos = await Producto.find({
      enSubasta: true, // Solo productos en subasta
      descripcion: { $regex: descripcionParcial, $options: "i" }, // Búsqueda con expresión regular, sin distinción entre mayúsculas y minúsculas
    });

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar productos en subasta" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByUserDescByDate,
  getProductsByDescription,
};
