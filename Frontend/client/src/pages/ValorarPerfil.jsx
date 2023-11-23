import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api2 from '../services/api2';
import { useParams } from 'react-router-dom';

const ValorarPerfil = () => {
    const {emailVendedor} = useParams();
    const [valoracion, setValoracion] = useState(0);
    const [resenas, setResenas] = useState([]);
    const [nota, setNota] = useState(1);
    const [descripcion, setDescripcion] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resenas = await api2.get(`usuarios/resena/${emailVendedor}`);
                if(!resenas){
                    console.error('No hay reseñas');
                }
                setResenas(resenas.data);

                const valoracion = await api2.get(`usuarios/valoracion/${emailVendedor}`);
                setValoracion(valoracion.data);
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        }
        fetchData();
    }, [emailVendedor]  );

    const handleSubmitResena = async (event) => {
        event.preventDefault();
    
        // Validación simple, puedes agregar más validaciones según tus necesidades
        if (nota < 1 || nota > 5 || descripcion.trim() === '') {
          alert('Por favor, complete todos los campos correctamente.');
          return;
        }

        await api2.post(`usuarios/resena/`,{
            emailVendedor,
            nota,
            descripcion,
        });
    
        const resenas = await api2.get(`usuarios/resena/${emailVendedor}`);
        if(!resenas){
          console.error('No hay reseñas');
        }
        setResenas(resenas.data);

        const valoracion = await api2.get(`usuarios/valoracion/${emailVendedor}`);
        setValoracion(valoracion.data);
    
        setNota(1);
        setDescripcion('');
    };

    return(
      <div>
      <h3>La valoracion es: </h3> {valoracion}
      <h2>Lista de Reseñas</h2>
      <ul>
        {resenas.map((resena, index) => (
          <li key={index}>
            Nota: {resena.nota}, Descripción: {resena.descripcion}
          </li>
        ))}
      </ul>
      <h2>Añadir Nueva Reseña</h2>
      <form onSubmit={handleSubmitResena}>
        <div>
          <label>
            Nota:
            <select value={nota} onChange={(e) => setNota(e.target.value)}>
              {[1, 2, 3, 4, 5].map((numero) => (
                <option key={numero} value={numero}>
                  {numero}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Descripción:
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">Agregar Reseña</button>
        </div>
      </form>
    </div>

    );
};

export default ValorarPerfil;