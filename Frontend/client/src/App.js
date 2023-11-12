import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';


// isAuthenticated es una variable de estado que indica si el usuario está autenticado o no. Al inicio, se establece en false porque asumimos que el usuario no está autenticado.
// setIsAuthenticated es una función que se utiliza para actualizar el estado de isAuthenticated. Cuando se llama, React re-renderizará el componente con el nuevo valor de isAuthenticated.

// useNavigate es un hook proporcionado por react-router-dom que devuelve una función de navegación. 
// Esta función puede ser utilizada para cambiar la URL y, por ende, navegar a diferentes rutas de tu aplicación.

// handleLogout es una función que se llama cuando se quiere realizar la acción de cerrar sesión. 
// En este ejemplo, simplemente cambia el estado de autenticación a false usando setIsAuthenticated(false).
// Esta función puede contener la lógica real de cierre de sesión, como la eliminación de tokens de autenticación, 
// la limpieza de la sesión, o cualquier otra acción necesaria cuando un usuario cierra sesión.

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica de cierre de sesión aquí
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div>
        <Link to="/mapa">
          <h2>Ir al mapa</h2>
        </Link>
      </div>
    </div>
  );
};

export default App;

// Prueba Juan Escritorio Remoto