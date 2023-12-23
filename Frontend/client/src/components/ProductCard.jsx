import React from 'react';
import '../styles/Card.css'



const ProductCard = ({ producto }) => {
  const { titulo, fotos, precioInicio, fechaFin, pujaMayor } = producto;

  return (
    <div className="card">
      <p className="card-title">{titulo}</p>
      <div className="image-carousel">
        <img className="card-img" src={fotos[0]} alt={titulo} />
      </div>
      <div className="card-bottom">
        <p className="price">Precio: {pujaMayor > 0 ? pujaMayor : precioInicio}€</p>
        <p className="close-date">Fecha fin: {formatFecha(fechaFin)}</p>
      </div>
    </div>
  );
};

// Función para formatear la fecha
const formatFecha = (fecha) => {
  if (!fecha) return 'No especificada';
  
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(fecha).toLocaleDateString(undefined, options);
};

export default ProductCard;
