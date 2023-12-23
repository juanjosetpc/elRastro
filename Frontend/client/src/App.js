import React, {useEffect, useState} from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
import Login from './pages/Login';
import CreateProduct from './pages/CreateProduct';
import Perfil from './pages/Perfil';
import ProductDetail from './pages/ProductDetail';
import ActivateProduct from './pages/ActivateProduct';

import Conversacion from './pages/Conversacion';
import ListaChats from './pages/listaChats';
import ValorarPerfil from './pages/ValorarPerfil';
import PerfilOtraPersona from './pages/PerfilOtraPersona';
import {jwtDecode} from 'jwt-decode';

// // isAuthenticated es una variable de estado que indica si el usuario está autenticado o no.
//  Al inicio, se establece en false porque asumimos que el usuario no está autenticado.
// // setIsAuthenticated es una función que se utiliza para actualizar el estado de isAuthenticated.
//  Cuando se llama, React re-renderizará el componente con el nuevo valor de isAuthenticated.

const App = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  // const [isAuthenticated, setIsAuthenticated] = React.useState( localStorage.getItem('isAuthenticated') === 'true');
  // const [userEmail, setUserEmail] = React.useState(localStorage.getItem('userEmail') || '');

  // const handleLogin = (email) => {
  //   setIsAuthenticated(true);
  //   setUserEmail(email);
  //   localStorage.setItem('isAuthenticated', 'true');
  //   localStorage.setItem('userEmail', email);
  // };

// // handleLogout es una función que se llama cuando se quiere realizar la acción de cerrar sesión.
// // En este ejemplo, simplemente cambia el estado de autenticación a false usando setIsAuthenticated(false).
// // Esta función puede contener la lógica real de cierre de sesión, como la eliminación de tokens de autenticación,
// // la limpieza de la sesión, o cualquier otra acción necesaria cuando un usuario cierra sesión.

  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  //   setUserEmail('');
  //   navigate('/');
  //   localStorage.removeItem('isAuthenticated');
  //   localStorage.removeItem('userEmail');
  // };

  useEffect(() => { 
    if (token) {
      const storedUser = jwtDecode(token);
      setUser(storedUser);
    }
  }, [token]);

    const handleLogin = (user, tokenNuevo) => {
      setUser(user);
      setToken(tokenNuevo)
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      setUser('');
      setToken('');
    };

  return (
    <div>
      <Navbar
        userEmail={user}
        logout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<HomePage propEmail={user.email}/>} />
        <Route
          path="/crear-producto"
          element={
            token ? <CreateProduct propEmail={user.email} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/perfil"
          element={token ? <Perfil propEmail={user.email}/> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/product/:id" 
          element={token ? <ProductDetail propEmail={user.email} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/valorarPerfil/:emailVendedor/:idProducto" 
          element={token ? <ValorarPerfil propEmail={user.email}/> : <Navigate to="/login" />}
        />
        <Route 
          path="/perfilOtraPersona/:emailVendedor" 
          element={token ? <PerfilOtraPersona propEmail={user.email}/> : <Navigate to="/login" />}
        />
        
        <Route path='/conversacion/:comprador/:vendedor/:producto'  element={ token ? <Conversacion userEmail={user.email} /> : <Navigate to="/login" /> } ></Route>
        <Route path='/chats/:usuario'  element={ token ? <ListaChats /> : <Navigate to="/login" /> } ></Route>

        <Route path="/editar-producto/:productoId" element={<CreateProduct propEmail={user.email} />} />
        <Route path="/activar-producto/:productoId" element={<ActivateProduct propEmail={user.email} />} />
      </Routes>
    </div>
  );
};

export default App;

