import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

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
      <h1>Aquí se hace la página en detalle de los productos</h1>
      {producto && (
        <div>
          {/* Renderiza los detalles del producto aquí utilizando el estado producto */}
          <p>ID: {producto._id}</p>
          <p>Nombre: {producto.titulo}</p>
          {/* Agrega más detalles según la estructura de tu objeto producto */}
        </div>
      )}
    </>
  );
};

export default ProductDetail;
