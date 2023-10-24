import axios from 'axios';


const buscarDireccion = async (direccion) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${direccion}`);
    if (response.data && response.data.length > 0) {
      
      const { lat, lon } = response.data[0];
      
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      throw new Error('No se encontraron resultados para la dirección proporcionada.');
    }
  } catch (error) {
    throw new Error(`Error al hacer la solicitud a la API: ${error.message}`);
  }
};

export default buscarDireccion;
