import React, { useState,useEffect,useRef } from 'react';
import { useParams } from 'react-router-dom';
import api2 from '../services/api2';
import '../styles/Conversacion.css'; // Ajusta el nombre y la ruta según sea necesario
import CryptoJS from 'crypto-js';

const claveSecreta = process.env.REACT_APP_claveSecreta;

function descifrarValor(valorCifrado, claveSecreta) {
  const cifradoDecodificado = decodeURIComponent(valorCifrado);
  const bytes = CryptoJS.AES.decrypt(cifradoDecodificado, claveSecreta);
  const valorDescifrado = bytes.toString(CryptoJS.enc.Utf8);
  return valorDescifrado;
}

const Conversacion = ({userEmail}) => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [conversations, setConversations] = useState([]);

  const {comprador, vendedor, producto} = useParams();

  const compradorDescifrado = descifrarValor(comprador, claveSecreta);
  const vendedorDescifrado = descifrarValor(vendedor, claveSecreta);

  const isMounted = useRef(true);


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if(isMounted.current)
        {
          const response = await api2.post('/conversaciones', {
            comprador: compradorDescifrado,
            vendedor: vendedorDescifrado,
            producto: producto
          },{ headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          }});
          const data = response.data; // Check the structure of the response
          
            setConversations(data.conversacionExistente);
            setMensajes(data.conversacionExistente.mensajes);
        }
        
      } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
      }
    };

    fetchConversations();
    return () => {
      isMounted.current = false;
    };

  
    
  }, []);


  const handleEnviarMensaje = async () => {
    if (nuevoMensaje.trim() === '' ) {
      // No permitir mensajes vacíos o si la conversación no está abierta
      return;
    }

    try {
      // Enviar el nuevo mensaje al backend
      const receptor = (userEmail == compradorDescifrado) ? vendedorDescifrado : compradorDescifrado; 
    
      const response = await api2.put(`/conversaciones/${vendedorDescifrado}/${compradorDescifrado}/${producto}`, {
        emisor: userEmail, // Puedes obtener el emisor desde algún lugar
        receptor: receptor, // Puedes obtener el receptor desde algún lugar
        fecha: Date.now(),
        contenido: nuevoMensaje,
      },{ headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      }});

      // Actualizar la lista de mensajes en el estado
      setConversations(response.data.conversacion)
      setMensajes(response.data.conversacion.mensajes);

      // Limpiar el campo de nuevo mensaje después de enviar
      setNuevoMensaje('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error.message);
    }
  };

  return (
    <div className="conversacion-container">
      
      <div className="mensajes-container">
      <h2 style={{marginBottom: '30px' }}>Conversación sobre {producto} {conversations.abierta ? '(Puja Abierta)' : '(Puja Cerrada)'}</h2> 
      
        {mensajes.map((mensaje, index) => (
          <div key={index}  className={`mensaje ${mensaje.emisor === vendedorDescifrado ? 'mensaje-derecha' : 'mensaje-izquierda'}`}
          style={{ backgroundColor: mensaje.emisor === vendedorDescifrado ? '#aaf' : '#afa',borderRadius: '10px',padding: '5px' }}>
            {mensaje.emisor === userEmail ? ( <strong>{mensaje.emisor}:</strong>) : (mensaje.emisor === compradorDescifrado ?
             (<strong>Usuario Anónimo:</strong>) : (<strong>{mensaje.emisor}:</strong>)
)} {mensaje.contenido}

          </div>
          
        ))}
      </div>
      {conversations.abierta && (
            <div className="input-container" style={{ textAlign: 'center', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
              <textarea
              className="textarea-estilizada"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe tu mensaje..."
              />
              <br />
              <button onClick={handleEnviarMensaje} className="boton-enviar">Enviar Mensaje</button>
            </div>
          )}
      
    </div>
  );
};

export default Conversacion;
