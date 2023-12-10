import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Carousel } from 'react-responsive-carousel'; // Asegúrate de tener esta línea de importación
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import BotonPujar from '../components/BotonPujar.jsx';
import Mapa from '../components/Mapa.jsx';

 import CryptoJS from 'crypto-js';

 function cifrarValor(valor, claveSecreta) {
  const cifrado = CryptoJS.AES.encrypt(valor, claveSecreta);
  return encodeURIComponent(cifrado.toString());
}
const claveSecreta = 'tuClaveSecreta';

const ProductDetail = ({ propEmail }) => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [pujaRealizada, setPujaRealizada] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [pujaMayor,setPujaMayor]=useState(null);


  useEffect(() => {

    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/productos/${id}`);
        setProducto(response.data);
        calcularTiempoRestante(response.data.fechaFin);
        setPujaMayor(response.data.pujaMayor);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    console.log("-----------")
    fetchProductDetails();

    const interval = setInterval(() => {
      calcularTiempoRestante(producto && producto.fechaFin);
    }, 1000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);

  }, [id, pujaRealizada,pujaMayor]);


  //Al poner el id como dependencia, nos aseguramos que se ejecute este useEffect cada vez
  //que cambie el id, es decir aseguramos que cada vez que cambiamos de producto
  //se hace la búsqueda de este con su id correspondiente.
  const handlePujaRealizada = () => {
    // Puedes realizar acciones adicionales aquí si es necesario
    setPujaRealizada(true);
    calcularTiempoRestante(producto && producto.fechaFin); // Actualizar el tiempo cuando se realiza una puja
  };

  const calcularTiempoRestante = (fechaFinISO) => {
    if (!fechaFinISO) {
      setTiempoRestante(null);
      return;
    }

    const fechaFin = new Date(fechaFinISO);
    const ahora = new Date();
    const diferencia = fechaFin - ahora;

    if (diferencia <= 0) {
      // El tiempo ha pasado, puedes manejar esto de acuerdo a tus necesidades
      setTiempoRestante('Tiempo expirado');
    } else {
      const segundos = Math.floor(diferencia / 1000) % 60;
      const minutos = Math.floor(diferencia / (1000 * 60)) % 60;
      const horas = Math.floor(diferencia / (1000 * 60 * 60)) % 24;
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

      setTiempoRestante(`${dias} días, ${horas} horas, ${minutos} minutos y ${segundos} segundos`);
    }
  };
  
  return (
    <>
      {producto && (
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
          {/* Renderiza los detalles del producto aquí utilizando el estado producto */}
          <h1>{producto.titulo}</h1>
          <h3>{producto.emailVendedor}</h3>
          <h3>{producto.descripcion}</h3>
          <br/>
          <br/>
          <br/>

           {/* Contenedor del Carrusel */}
          <div style={{ maxWidth: '300px', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {/* Carrusel de imágenes */}
            {producto.fotos && producto.fotos.length > 0 && (
              <Carousel>
                {producto.fotos.map((imagen, index) => (
                  <div key={index}  >
                    <img
                      src={imagen}
                      alt={`Imagen ${index + 1}`}
                      style={{ maxHeight: '500px' }}
                    />
                  </div>
                ))}
              </Carousel>
            )}
          </div>
          <br/>
          <br/>
          <br/>

          <div>
          {(producto.emailVendedor != propEmail) && (
    <Link to={`/conversacion/${cifrarValor(propEmail, claveSecreta)}/${cifrarValor(producto.emailVendedor, claveSecreta)}/${producto.titulo}`}><button>Consultar</button></Link>)}
    </div>
          <div>
            <h2>Localizacion</h2>
            <p>{producto.direccion}</p>
            <div className='Mapa'>
              <Mapa direccion={producto.direccion} />
            </div>
          </div>
          <br/>

          <div>
            <h2>Fecha de Fin: {formatFecha(producto.fechaFin)}</h2>
            <h2>Tiempo Restante: {tiempoRestante}</h2>
          </div>
          <br/>

          <div>
            <h2>Precios</h2>
            <p>Precio de inicio: {producto.precioInicio}</p>
            <p>Precio actual de la puja : {producto.pujaMayor}</p>
            {producto.emailVendedor === propEmail ? (<p></p>) : (
              <div className="botonPuja">
                <BotonPujar producto={producto} emailPujador={propEmail} onPujaRealizada={handlePujaRealizada} />                 </div>
            )}

          </div>
          <div>
              {producto.emailVendedor === propEmail ? (
                <Link to="/perfil">
                  <button>Ver mi perfil</button>
                </Link>
              ) : (
                <Link to={`/perfilOtraPersona/${producto.emailVendedor}`}>
                  <button>Ver perfil vendedor</button>
                </Link>
              )}
          </div>
          
        </div>
      )}
    </>
  );
};
const formatFecha = (fecha) => {
  if (!fecha) return 'No especificada';
  
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(fecha).toLocaleDateString(undefined, options);
};

export default ProductDetail;

