import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../services/api';
import "..styles/ProductList.css";

const ProductList = () => {
  //Aqui lo que se hace es almacenar en productos el estado actual. Inicialmente []
  //y setProductos será la función que se utiliza para actualizar el estado de la variable productos.
  //useState es un hook de react que se utiliza para agregar estado a un componente funcional. 
  //La función useState toma un argumento que representa el valor inicial del estado ([] en este caso)
  // y devuelve un array con dos elementos: la variable de estado (productos) y la función para actualizar el estado (setProductos).
  const [productos, setProductos] = useState([]);


//useEffect se ejecutará después de cada renderizado del componente.
useEffect(() => {
  const fetchProductos = async () => {
    try {
      const { data } = await api.get('/productos');

      setProductos(data);
     
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  fetchProductos();
}, []);

  //Ese [] como segundo parámetro de useEffect es un array de dependencias. 
  //Cuando este array está vacío ([]), el efecto se ejecuta solo después del primer renderizado del componente. 
  //Si tuviera dependencias, el efecto se ejecutaría cada vez que una de esas dependencias cambie.

  return (
    <div className='products'>
      <div className='product-grid'>

        {productos.map((producto) => (
          <ProductCard key={producto._id} producto={producto} />
          ))}
          </div>
    </div>
  );
};

export default ProductList;
