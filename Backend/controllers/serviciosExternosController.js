const { fakerES, faker } = require("@faker-js/faker"); //Importamos solo el módulo en español
const axios = require("axios");

let cachedData = null;

const getAllProducts = async (req, res) => {
  if (cachedData == null) {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      const productos = response.data;

      const ProductosAdaptados = productos.map((producto) => {
        return {
          emailVendedor: fakerES.internet.email(),
          direccion: fakerES.location.streetAddress(),
          titulo: producto.title,
          descripcion: producto.description,
          precioInicio: producto.price,
          fotos: [producto.image],
        };
      });

      cachedData = ProductosAdaptados;
      // Almacena los datos transformados en caché
    } catch (error) {
      console.error("Error al obtener datos de la API", error.message);
      res.status(500).json({ error: "Error al obtener datos de la API" });
    }
  }

  try {
    const endPointProductos = "http://localhost:5000/api/v1/productos";
    const response = await axios.post(endPointProductos, cachedData);
    res.status(201).json(response.data);
  } catch (error) {}
};

/*
const createProducts = async (req, res) => {
  try {
    if (cachedData != null) {
      axios.get("http://localhost:5000/api/v1/externos/productos");
    }

    const ProductosAdaptados = cachedData.map((producto) => {
      return {
        emailVendedor: fakerES.internet.email(),
        direccion: fakerES.location.streetAddress(),
        titulo: producto.title,
        descripcion: producto.description,
        precioInicio: producto.price,
        fotos: [producto.image],
      };
    });

    const endPointProductos = "http://localhost:5000/api/v1/productos";
    const response = await axios.post(endPointProductos, ProductosAdaptados);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error al crear el producto: ", error + ": " + error.message);
  }
};*/

module.exports = { getAllProducts };
