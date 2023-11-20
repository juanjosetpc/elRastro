import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Carousel } from 'react-responsive-carousel'; // Asegúrate de tener esta línea de importación
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import BotonPujar from '../components/BotonPujar.jsx';

const ProductDetail = () => {
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
            <h2>Localizacion</h2>
            <p>{producto.direccion}</p>
            <p>--------------Mapa--------------</p>
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
