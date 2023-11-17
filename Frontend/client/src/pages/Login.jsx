import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (email.trim() === '') {
        alert('Por favor, ingresa tu correo electrónico.');
        return;
      }

      // Realiza la solicitud al backend para obtener los productos del usuario
      const response = await api.get(`/productos/ofertados/${email}`);

      // Verifica si el usuario tiene productos
      if (response.data.length > 0) {
        // Llama a la función onLogin para pasar el correo electrónico
        onLogin(email);

        // Navega a la página de inicio después del inicio de sesión
        navigate('/');
      } else {
        alert('Este usuario no tiene productos.');
      }
    } catch (error) {
      console.error('Error en la solicitud de productos:', error);
      alert('Hubo un error al obtener los productos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <label htmlFor="email">Correo Electrónico:</label>
      <input
        type="email"
        id="email"
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
};

export default Login;
