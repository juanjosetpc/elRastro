const Producto = require("../models/producto");
const colors = require("picocolors");
const Puja = require("../models/puja");
const cloudinary = require("cloudinary");

// Configuración de Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
  secure: true,
});

const getAllProducts = async (req, res) => {
  try {
    const products = await Producto.find();
    if (!products || products.length === 0) {
      console.log(colors.yellow("No se encontraron productos"));
      return res.status(404).json({ error: "No se encontraron productos" });
    }
    console.log(colors.blue("Se han obtenido los productos"));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Producto.findById(id);
    if (!product) {
      console.log(colors.yellow("No se encontró el producto"));
      return res.status(404).json({ error: "No se encontró el producto" });
    }
    console.log(colors.blue("Se ha obtenido el producto " + product.titulo + " con id " + id  ));
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

const createProduct = async (req, res) => {
  try {

    const producto = req.body;

      // Comprobar si ya existe un producto con los mismos datos
      const productoExistente = await Producto.findOne({
        emailVendedor: producto.emailVendedor,
        titulo: producto.titulo,
        descripcion: producto.descripcion,
      });

      if (productoExistente) {
        // Si el producto ya existe, puedes omitirlo o manejarlo según tus necesidades
        console.log(colors.yellow(`El producto ya existe: ${productoExistente.titulo}`));
        res.status(201).send("Los productos ya estaban en la base de datos");
      } else {
        // Si el producto no existe, créalo y agrégalo a la lista de nuevos productos
        const nuevoProducto = await Producto.create(producto);
        console.log(colors.blue(`Nuevo producto creado: ${nuevoProducto}`));
        res.status(201).json({ nuevoProducto });
      }
    
  } catch (error) {
    res.status(500).json({ error: "Error al crear los productos" });
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const datosActualizar = req.body;

  try {
    const product = await Producto.findById(id);
    if(!product){
      console.log(colors.yellow("No se encontró el producto para actualizarlo"));
      return res.status(404).json({ error: "Producto no encontrado" });
    }else if(product.pujaMayor > 0){
      console.log(colors.yellow("No se puede actualizar el producto, ya hay alguna puja"));
      return res.status(400).json({ error: "No se puede actualizar el producto, ya hay alguna puja" });
    }else{
      const producto = await Producto.findByIdAndUpdate(id, datosActualizar, {
        new: true,
      });
      console.log(colors.blue("Producto actualizado" + producto.titulo));
      res.status(200).json({ mensaje: "Producto actualizado", producto });
    }
  
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar el producto. Error msg: " + error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await Producto.findById(id);

    if (!producto) {
      console.log(colors.yellow("No se encontró el producto para borrarlo"));
      return res.status(404).json({ error: "Producto no encontrado" });
    }else if(producto.pujaMayor > 0){
      console.log(colors.yellow("No se puede borrar el producto, ya hay alguna puja"));
      return res.status(400).json({ error: "No se puede borrar el producto ya hay alguna puja" });
    }else{
      await Producto.findByIdAndDelete(id);
      console.log(colors.blue("Producto borrado" + producto.titulo));
      res.status(204).send(); // Respuesta exitosa sin contenido
    }
  } catch (error) {
    res.status(500).json({ error: "Error al intentar borrar el producto" });
  }
};

//Obtener productos ofertados por un usuario descendente por fecha de inicio
const getProductsByUserDescByDate = async (req, res) => {
  const vendedor = req.params.email;
  try {
    const productos = await Producto.find({ emailVendedor: vendedor }).sort({
      fechaInicio: -1,
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      error:
        "Error al obtener los productos. Mensaje de error: " + error.message,
    });
  }
};

//Producto en subasta a partir de (parte de) su descripción
const getProductsByDescription = async (req, res) => {
  const descripcion = req.query.descripcion;
  try {
    // Realiza una consulta para encontrar productos en subasta que contengan la descripción parcial
    const productos = await Producto.find({
      enSubasta: true, // Solo productos en subasta
      descripcion: { $regex: descripcion, $options: "i" }, // Búsqueda con expresión regular, sin distinción entre mayúsculas y minúsculas
    });

    console.log(colors.blue("Buscando productos en subasta con descripción: " + descripcion));

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      error:
        "Error al buscar productos en subasta. Mensaje de error: " +
        error.message,
    });
  }
};


const getProductsOfSeller = async (req, res) => {
  const email = req.params.email;
  const activo = req.query.activo;
  try {
    const productos = await Producto.find({
      emailVendedor: email,
      enSubasta: activo,
      fechaFin: { $gt: new Date() },
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      error:
        "Error al obtener los productos. Mensaje de error: " + error.message,
    });
  }
}

const activateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      console.log(colors.yellow("No se encontró el producto para activarlo"));
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    producto.enSubasta = true;
    producto.fechaInicio = new Date();
    await producto.save();
    res.status(200).json({ mensaje: "Producto activado", producto });
  } catch (error) {
    res.status(500).json({
      error: "Error al activar el producto. Mensaje de error: " + error.message,
    });
  }
}

const getProductsBuying = async (req, res) => {
  const email = req.params.email;
  try {
    const idsProductos = await Puja.distinct("producto", { emailPujador: email });
    const productosPujados = await Producto.find({ _id: { $in: idsProductos } });
    
    res.json(productosPujados);
    
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

const getProductsFilter = async (req, res) => {
  try {
    const descripcion = req.query.descripcion;
    const email = req.query.email;
    const fechaFinOrd = req.query.fechaFin;
    const distancia = req.query.distancia;
    const precio = req.query.precio;

    let query = { enSubasta: true }; 

    if (descripcion) {
      query.descripcion = { $regex: descripcion, $options: "i" };
    }
    if (email) {
      query.emailVendedor = { $regex: email, $options: "i" };
    }
    // if (distancia) {
    //   query.distancia = { $lte: distancia };
    // }
    if (precio) {
      query.$or = [
        { pujaMayor: { $lte: precio, $ne: 0} },
        { precioInicio: { $lte: precio } }
      ];
    }
    
    let sortQuery = {};
    if (fechaFinOrd == 1 || fechaFinOrd == -1) {
      sortQuery.fechaFin = parseInt(fechaFinOrd);
    }

    const productos = await Producto.find(query).sort(sortQuery);

    res.json(productos);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos. " + error.message });
  }
}



const actualizarSubastasExito = async () => {
  try {
    const subastas = await Producto.find({ enSubasta: true, fechaFin: { $lte: new Date() } });

    for (const subasta of subastas) {
      if (subasta.pujaMayor > 0) {
        subasta.enSubasta = false;
        const ganador = subasta.emailComprador;
        const vendedor = subasta.emailVendedor;

        // adjudicarSubasta(subasta, ganador, vendedor); //Hacer proximamente la notificacion a vendedor y comprador
      }
    }
  } catch (error) {
    console.error('Error al actualizar subastas:', error);
  }
};


//Control periódico de las subastas que han terminado sin pujas y se consideran desiertas.
// En ese caso, se iniciará automáticamente una nueva subasta, con la misma duración, y con un precio salida un 10%
// inferior al inicial
const actualizaDesiertas = async () => {
  try {
    const productos = await Producto.find({ enSubasta: true, fechaFin: { $lt: new Date() }, pujaMayor: 0 });
    for (const producto of productos) {
      producto.fechaFin = new Date(producto.fechaFin.getTime() + producto.fechaFin.getTime() - producto.fechaInicio.getTime());
      producto.fechaInicio = new Date();
      producto.precioInicio = producto.precioInicio * 0.9;
      await producto.save();
    }
    
  } catch (error) {
    console.log(colors.red("Error al actualizar las subastas desiertas. " + error.message));
  }}
 





module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByUserDescByDate,
  getProductsByDescription,
  getProduct,
  getProductsOfSeller,
  activateProduct,
  getProductsBuying,
  getProductsFilter,
  actualizaDesiertas,
  actualizarSubastasExito
};
