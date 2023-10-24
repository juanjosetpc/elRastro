import React from 'react';
import logo from './logo.svg';
import './App.css';
import MapaPage from './mapa/mapa';
import MapaComponent from './mapa/mapa';
import   {Routes, Route, Link } from 'react-router-dom';


const App = () => {
  

  return (
    

      <MapaComponent />
      
     /*<Routes>
      <Link to="/mapa">Ir al Mapa</Link>
      <Route path="/mapa" component={MapaPage} />
  </Routes>*/


    
  );
}

export default App;
