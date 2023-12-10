import React, { useState } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import '../styles/BotonPujar.css'; // Importa el archivo CSS

const BotonPujar = ({ producto, emailPujador, onPujaRealizada }) => {
  const [precio, setPrecio] = useState(''); //precio es la variable donde se guarda la puja
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mostrarPopupError, setMostrarPopupError] = useState(false);

  const handlePujar = async () => {
    if (precio > producto.pujaMayor && precio > producto.precioInicio) {
      setMostrarPopup(true);

      // Ocultar el popup después de 2 segundos (ajusta según tus necesidades)
      setTimeout(() => {
        setMostrarPopup(false);
      }, 2000);

      // Realizar la llamada a la API
      const response = await axios.post(`http://localhost:5000/api/v1/pujas/`, {
        producto: producto._id,
        cantidad: precio,
        emailPujador: emailPujador
      });

      // Llamar a la función proporcionada para indicar que la puja ha sido realizada
      onPujaRealizada();
    } else {
      setMostrarPopupError(true);
      // Ocultar el popup después de 2 segundos (ajusta según tus necesidades)
      setTimeout(() => {
        setMostrarPopupError(false);
      }, 3000);
      
    }
  };

  return (
    <div>
    {(mostrarPopup && <div className="overlay"></div>) || (mostrarPopupError && <div className="overlay"></div>) }
    <div style={{ textAlign: 'center', maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Pujar</h2>
      <input
        type="number"
        placeholder="Ingrese el precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        style={{ padding: '10px', marginRight: '10px' }}
      />
      <button onClick={handlePujar} style={{ padding: '10px' }}>
        Pujar
      </button>

      {/* Mostrar el popup si mostrarPopup es verdadero */}
      {mostrarPopup && (
        
        <div className="popup">
          <p>Puja Realizada</p>
        </div>
      )  }
      {/* Mostrar el popupError si mostrarPopup es verdadero */}
      {mostrarPopupError && (
        
        <div className="popup">
          <p>La puja tiene que ser mayor al precio de inicio y al de la puja mayor</p>
        </div>
      )  }
    </div>
    </div>
  );
};



export default BotonPujar;

