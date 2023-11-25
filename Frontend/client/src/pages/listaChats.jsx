// ListaChats.js

import React, {useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import api2 from '../services/api2';
import CryptoJS from 'crypto-js';

function cifrarValor(valor, claveSecreta) {
  const cifrado = CryptoJS.AES.encrypt(valor, claveSecreta);
  return encodeURIComponent(cifrado.toString());
}

const claveSecreta = 'tuClaveSecreta';


const ListaChats = () => {
  const { usuario } = useParams();
  const [conversations, setConversations] = useState([]);
  const [productos, setProducto] = useState([]);
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api2.get('/conversaciones');
        const data = response.data; // Check the structure of the response
        
        // Filtra las conversaciones donde el usuario es emisor o receptor
        const filteredConversations = data.filter(
          (conversation) =>
            (conversation.vendedor == usuario || conversation.comprador == usuario) 
        );

        setConversations(filteredConversations);
      } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
      }
    };
  
    fetchConversations();
  }, [usuario]);

  return (
    <div>
      <h2 style={{marginBottom: '25px' }}>Chats disponibles para {usuario}</h2>
      <ul>
      {conversations.map((conversation) => (
          <li key={conversation._id}>
            <Link to={`/conversacion/${cifrarValor(conversation.comprador, claveSecreta)}/${cifrarValor(conversation.vendedor, claveSecreta)}/${conversation.producto}`}>
              <Button>Chat sobre {conversation.producto} </Button>
            </Link>
            <p></p>
          </li>
            
        ))}
      </ul>
    </div>
  );
};

export default ListaChats;
