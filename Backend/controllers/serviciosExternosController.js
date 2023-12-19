const axios = require("axios");
const colors = require("picocolors");


const calculaCarbonoDadosLosLugares = async (req, res) => {
    try {
      //Lugar uno viene ya en lat y lon, coge la posicion del navegador
      const { latCurr, lonCurr, lugar } = req.query; 

      const encodedLugar = encodeURIComponent(lugar);
      const apiUrl2 = `https://nominatim.openstreetmap.org/search?q=${encodedLugar}&format=json&limit=1`;
  
      const response2 = await axios.get(apiUrl2);
      
      const coordenadas2 = response2.data[0];
      const distancia = calcularDistancia(latCurr, lonCurr, coordenadas2.lat, coordenadas2.lon);

      const apiCarbono = 'https://www.carboninterface.com/api/v1/estimates';
      const apiKey = process.env.API_KEY_CARBONO; 
  
      const postData = {
        type: 'vehicle',
        distance_unit: 'km',
        distance_value: distancia,
        vehicle_model_id: '7268a9b7-17e8-4c8d-acca-57059252afe9'
      };
      
      if(distancia > 0){
        // Realizar una solicitud POST a la API de Carbon Interface usando Axios
        const response = await axios.post(apiCarbono, postData, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });

        // Extraer el campo 'carbon_kg' de la respuesta y enviar solo ese valor como respuesta
        const carbon = response.data?.data?.attributes?.carbon_kg || 0;

        // Estimo 0.08149 por kilo de CO2 liberado
        const precio = 0.08149 * carbon;
        res.json({ carbon_kg: carbon, precio_euros: precio });
      }

    } catch (error) {
      // Manejar errores y enviar una respuesta de error al cliente
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al intentar obtener el coste de huella de carbono entre posición y lugar' });
    }
  };


const calcularHuellaCarbono = async (req, res) => {
  try {
    const { distance_value } = req.params; // Obtener el parámetro de distancia_value de la URL
    const apiUrl = 'https://www.carboninterface.com/api/v1/estimates';
    const apiKey = process.env.API_KEY_CARBONO; // Reemplaza 'API_KEY' con tu clave de API real

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
    const { lugar1, lugar2 } = req.query; // Obtener los parámetros de las ubicaciones de la URL
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

const cambioDivisa = async (req, res) => {
  try {
    const idProducto = req.params.idProducto; // Obtener el parámetro de idProducto de la URL
    const apiKey = process.env.API_KEY_DIVISAS;

    let nuevaDivisa =  req.query.nuevaDivisa; // Reemplaza con la divisa a la que deseas convertir
    nuevaDivisa = nuevaDivisa.toUpperCase();

    const apiUrl = `http://api.currencylayer.com/live?access_key=${apiKey}&currency=${nuevaDivisa}&source=EUR&format=1}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const cambio = response.data.quotes["EUR"+nuevaDivisa];
        console.log(`La tasa de cambio de 1 EURO a ${nuevaDivisa} es: ${cambio}`);

       
        axios
          .get(`http://localhost:5000/api/v1/productos/${idProducto}`)
          .then((response) => {
            const product = response.data;
            const fee = 0.01; // 1% de comisión por aplicarles la conversión del cambio de divisa
            const precio = product.precioInicio * cambio;

            res.status(200).json({
              producto: product,
              cambioDeEUR: { a: nuevaDivisa, cambio: cambio },
              precio: {
                precioConvertido: precio,
                precioConFee: precio* fee+ precio,
              },
            });

          })
          .catch((error) => {
            console.error(
              colors.red("Error al obtener el producto:" + error.message)
            );
          });

       

      })
      .catch((error) => {
        console.error(colors.red("Error al obtener la tasa de cambio:", error));
      });

      


  } catch (error) {
    console.error(colors.red("Error:", error.message));
    res.status(500).send("Error: " + error.message);
  }
};


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


const NodeCache = require("node-cache");
const cache = new NodeCache();

const geocache = async (req, res) => {
  const direccion = req.query.direccion;
  const direccionCodificada = encodeURIComponent(direccion);

  const cachedCoordinates = cache.get(direccionCodificada);

  if(cachedCoordinates) {
    console.log('Coordenadas obtenidas de la caché');
    return res.json(cachedCoordinates);
  }
  try {
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${direccionCodificada}&format=json&limit=1`;

    const response = await axios.get(apiUrl);
    const result = response.data[0];
    const coordinates = {
      posicion: [result.lat, result.lon],
      nombre: direccionCodificada,
    };
    cache.set(direccionCodificada, coordinates, 5 * 60);
    console.log('Obteniendo coordenadas desde la API');
    res.json(coordinates);
  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener coordenadas' });
  }
}

module.exports = { obtenerCoordenadas, calcularHuellaCarbono, cambioDivisa, geocache, calculaCarbonoDadosLosLugares };
