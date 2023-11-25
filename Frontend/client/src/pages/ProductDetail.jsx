import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Carousel } from 'react-responsive-carousel'; // Asegúrate de tener esta línea de importación
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import BotonPujar from '../components/BotonPujar.jsx';
import Mapa from '../components/Mapa.jsx';
 import axios from 'axios';
 import CryptoJS from 'crypto-js';

 function cifrarValor(valor, claveSecreta) {
  const cifrado = CryptoJS.AES.encrypt(valor, claveSecreta);
  return encodeURIComponent(cifrado.toString());
}


const claveSecreta = 'tuClaveSecreta';

const ProductDetail = ({userEmail}) => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/productos/${id}`);
        setProducto(response.data);
        

      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);
  //Al poner el id como dependencia, nos aseguramos que se ejecute este useEffect cada vez
  //que cambie el id, es decir aseguramos que cada vez que cambiamos de producto
  //se hace la búsqueda de este con su id correspondiente.

  return (
    <>
      {producto && (
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
          {/* Renderiza los detalles del producto aquí utilizando el estado producto */}
          <p>ID: {producto._id}</p>
          <h1>{producto.titulo}</h1>
          {/* Agrega más detalles según la estructura de tu objeto producto */}
          {/* Contenedor del Carrusel */}
          <div style={{ maxWidth: '300px', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              {/* Carrusel de imágenes */}
              {producto.fotos && producto.fotos.length > 0 && (
                <Carousel>
                  {producto.fotos.map((imagen, index) => (
                    <div key={index} style={{ maxWidth: '300px', maxHeight: '200px', margin: 'auto' }}>
                      <img
                        src={imagen}
                        alt={`Imagen ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </Carousel>
              )}
          </div>
          <div>
          {(producto.emailVendedor != userEmail) && (
    <Link to={`/conversacion/${cifrarValor(userEmail, claveSecreta)}/${cifrarValor(producto.emailVendedor, claveSecreta)}/${producto.titulo}`}><button>Consultar</button></Link>)}
    </div>
          <div>
            <h2>Localizacion</h2>
            <p>{producto.direccion}</p>
            <div className='Mapa'>
                <Mapa direccion = {producto.direccion}/>
            </div>
          </div>
          <div>
            <h2>Pujas</h2>
            <p>Precio de inicio: {producto.precioInicio}</p>
            <p>Precio actual de la puja : {producto.pujaMayor}</p>
            <div className="botonPuja">
              <BotonPujar  producto = {producto}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../services/api';
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import BotonPujar from '../components/BotonPujar.jsx';
// import Mapa from '../components/Mapa.jsx';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [producto, setProducto] = useState(null);
//   const [coordinates, setCoordinates] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await api.get(`/productos/${id}`);
//         setProducto(response.data);

//         if (response.data.direccion) {
//           const apiUrl = `https://nominatim.openstreetmap.org/search?q=${response.data.direccion}&format=json&limit=1`;
//           const [responseCoord] = await Promise.all([axios.get(apiUrl)]);
//           const results = responseCoord.data[0];

//           // Update coordinates state with the obtained values
//           setCoordinates([results.lat, results.lon]);
//           setLoading(false); // Set loading to false once coordinates are fetched
//         }
//       } catch (error) {
//         console.error('Error fetching product details:', error);
//       }
//     };

//     fetchProductDetails();
//   }, [id]);

//   return (
//     <>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         producto && (
//           <div style={{ textAlign: 'center', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
//             {/* ... (other renderings) */}
//             <div className='Mapa'>
//               {/* Pass coordinates directly to Mapa component */}
//               <Mapa coordinates={[-40,-3]} />
//             </div>
//           </div>
//         )
//       )}
//     </>
//   );
// };

// export default ProductDetail;
