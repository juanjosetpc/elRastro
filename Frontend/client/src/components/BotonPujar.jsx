import React, { useState } from 'react';
import axios from 'axios';

const BotonPujar = ({producto}) => {
  const [precio, setPrecio] = useState(''); //precio es la variable donde se guarda la puja

  //Lo que ocurre al pulsar el boton
  const handlePujar = async () => {//Si se ejeculta, para ver el consolelog, en google : inspeccionar y entrar en la pestaña consola
        if(precio > producto.pujaMayor){
            const response = await axios.put(`http://localhost:5000/api/v1/productos/${producto._id}`, { "pujaMayor" : precio });
            console.log('Precio actualizado:', response.data);
            //De alguna manera, saber que Tu ya has pujado a ese producto.
        }else{
            console.log("ERROR : la puja es menor");
        }
    
    };

  return (
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
    </div>
  );
};



export default BotonPujar;
