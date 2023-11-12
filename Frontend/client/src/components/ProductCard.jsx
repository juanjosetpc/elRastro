import React from 'react';
import Slider from 'react-slick';
import '../styles/Card.css'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductCard = ({ producto }) => {
  const { titulo, fotos, precioInicio, fechaFinSubasta } = producto;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="card">
      <p className='card-title'>{titulo}</p>
      <div className="image-carousel">
        <Slider {...settings}>
          {fotos.map((imagen, index) => (
            <div key={index}>
              <img className='card-img' src={imagen} alt={`Imagen ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
      <div className='card-bottom'>

      <p className='price'>Precio: {precioInicio}€</p>
      <p>Fecha de Fin de Subasta: {formatFecha(fechaFinSubasta)}</p>
      </div>
    </div>
  );
};

// Función para formatear la fecha
const formatFecha = (fecha) => {
  if (!fecha) return 'No especificada';
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString(undefined, options);
};

export default ProductCard;
