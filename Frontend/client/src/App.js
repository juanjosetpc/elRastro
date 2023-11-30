import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
import Login from './pages/Login';
import CreateProduct from './pages/CreateProduct';
import Perfil from './pages/Perfil';
import ProductDetail from './pages/ProductDetail';
import Mapa from './mapa/mapa';
import Conversacion from './pages/Conversacion';
import ListaChats from './pages/listaChats';
import buscarDireccion from './mapa/MapaApi';
import ValorarPerfil from './pages/ValorarPerfil';
import PerfilOtraPersona from './pages/PerfilOtraPersona';

// // isAuthenticated es una variable de estado que indica si el usuario está autenticado o no.
//  Al inicio, se establece en false porque asumimos que el usuario no está autenticado.
// // setIsAuthenticated es una función que se utiliza para actualizar el estado de isAuthenticated.
//  Cuando se llama, React re-renderizará el componente con el nuevo valor de isAuthenticated.

const App = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState( localStorage.getItem('isAuthenticated') === 'true');
  const [userEmail, setUserEmail] = React.useState(localStorage.getItem('userEmail') || '');

  const handleLogin = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
  };

// // handleLogout es una función que se llama cuando se quiere realizar la acción de cerrar sesión.
// // En este ejemplo, simplemente cambia el estado de autenticación a false usando setIsAuthenticated(false).
// // Esta función puede contener la lógica real de cierre de sesión, como la eliminación de tokens de autenticación,
// // la limpieza de la sesión, o cualquier otra acción necesaria cuando un usuario cierra sesión.

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    navigate('/');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  };

  return (
    <div>
      <Navbar
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        logout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<HomePage propEmail={userEmail}/>} />
        <Route
          path="/crear-producto"
          element={
            isAuthenticated ? <CreateProduct propEmail={userEmail} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/perfil"
          element={isAuthenticated ? <Perfil propEmail={userEmail}/> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/product/:id" 
          element={isAuthenticated ? <ProductDetail propEmail={userEmail} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/valorarPerfil/:emailVendedor/:idProducto" 
          element={isAuthenticated ? <ValorarPerfil propEmail={userEmail}/> : <Navigate to="/login" />}
        />
        <Route 
          path="/perfilOtraPersona/:emailVendedor" 
          element={isAuthenticated ? <PerfilOtraPersona propEmail={userEmail}/> : <Navigate to="/login" />}
        />
        <Route path='/mapa' element={<Mapa direccion="Vialia Centro, Málaga"/>}> </Route>
        <Route path='/conversacion/:comprador/:vendedor/:producto'  element={ isAuthenticated ? <Conversacion userEmail={userEmail} /> : <Navigate to="/login" /> } ></Route>
        <Route path='/chats/:usuario'  element={ isAuthenticated ? <ListaChats /> : <Navigate to="/login" /> } ></Route>

        <Route path="/editar-producto/:productoId" element={<CreateProduct />} />
      </Routes>
    </div>
  );
};

export default App;

