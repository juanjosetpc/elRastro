import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api2 from '../services/api2';


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
      const usuario = await api2.get(`/usuarios/${email}`);

      // Verifica si el usuario tiene productos
      if (usuario) {
        // Llama a la función onLogin para pasar el correo electrónico
        onLogin(email);

        // Navega a la página de inicio después del inicio de sesión
        navigate('/');
      } else {
        alert('Este usuario no existe.');
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
