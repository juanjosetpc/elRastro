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

const calcularHuellaCarbono = async (req, res) => {
  try {
    const { distance_value } = req.params; // Obtener el parámetro de distancia_value de la URL
    const apiUrl = 'https://www.carboninterface.com/api/v1/estimates';
    const apiKey = 'qRmdCDb9W2axwvKvq9g'; // Reemplaza 'API_KEY' con tu clave de API real

    // Datos para la solicitud POST, incluyendo distance_value del parámetro
    const postData = {
      type: 'vehicle',
      distance_unit: 'km',
      distance_value: distance_value,
      vehicle_model_id: '7268a9b7-17e8-4c8d-acca-57059252afe9'
    };

    // Realizar una solicitud POST a la API de Carbon Interface usando Axios
    const response = await axios.post(apiUrl, postData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Extraer el campo 'carbon_kg' de la respuesta y enviar solo ese valor como respuesta
    const carbon = response.data?.data?.attributes?.carbon_kg || 0;

    // Enviar solo el campo 'carbon_kg' como respuesta a la solicitud del cliente

    // Estimo 0.08149 por kilo de CO2 liberado
    const precio = 0.08149 * carbon ;
    res.json({ carbon_kg: carbon, precio_euros : precio});
  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al hacer la solicitud a la API de Carbon Interface' });
  }
}

const obtenerCoordenadas = async (req, res) => {
  try {
    const { lugar1, lugar2 } = req.params; // Obtener los parámetros de las ubicaciones de la URL
    const apiUrl1 = `https://nominatim.openstreetmap.org/search?q=${lugar1}&format=json&limit=1`;
    const apiUrl2 = `https://nominatim.openstreetmap.org/search?q=${lugar2}&format=json&limit=1`;

    // Realizar las solicitudes GET a OpenStreetMap usando Axios para ambas ubicaciones
    const [response1, response2] = await Promise.all([
      axios.get(apiUrl1),
      axios.get(apiUrl2)
    ]);

    // Obtener las coordenadas (latitud y longitud) de las ubicaciones desde las respuestas
    const coordenadas1 = response1.data[0];
    const coordenadas2 = response2.data[0];

    // Calcular la distancia entre las ubicaciones (puedes implementar tu propia lógica para calcular la distancia)
    const distancia = calcularDistancia(coordenadas1.lat, coordenadas1.lon, coordenadas2.lat, coordenadas2.lon);

    // Enviar las coordenadas y la distancia como respuesta a la solicitud del cliente
    res.json({
      lugar1: { latitud: coordenadas1.lat, longitud: coordenadas1.lon },
      lugar2: { latitud: coordenadas2.lat, longitud: coordenadas2.lon },
      distancia_km: distancia
    });
  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener coordenadas y calcular la distancia' });
  }
}


// Función para calcular la distancia entre dos puntos geográficos con Haversine
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const radioTierraKm = 6371; // Radio de la Tierra en kilómetros
  const dLat = deg2rad(lat2 - lat1); // Diferencia de latitud en radianes
  const dLon = deg2rad(lon2 - lon1); // Diferencia de longitud en radianes

  // Aplicar la fórmula de Haversine para calcular la distancia
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = radioTierraKm * c; // Distancia en kilómetros

  return distancia;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


module.exports = { getAllProducts, obtenerCoordenadas, calcularHuellaCarbono };
