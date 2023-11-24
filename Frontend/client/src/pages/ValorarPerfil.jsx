import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Pagination } from 'react-bootstrap';
import api2 from '../services/api2';
import { useParams } from 'react-router-dom';
import "../styles/ValorarPerfil.css";

const ValorarPerfil = () => {
    const {emailVendedor} = useParams();
    const [usuario, setUsuario] = useState(null);
    const [valoracion, setValoracion] = useState(0);
    const [resenas, setResenas] = useState([]);
    const [nota, setNota] = useState(1);
    const [descripcion, setDescripcion] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const resenasPerPage = 5;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuario = await api2.get(`usuarios/${emailVendedor}`);
                setUsuario(usuario.data);

                const nombre = usuario.data.nombre;
                setNombre(nombre);

                const apellido = usuario.data.apellido;
                setApellido(apellido);

                //const resenas = await api2.get(`usuarios/resena/${emailVendedor}`);
                const resenas = usuario.data.resenas;
                if(!resenas){
                    console.error('No hay reseñas');
                }
                setResenas(resenas);

                //const valoracion = await api2.get(`usuarios/valoracion/${emailVendedor}`);
                const valoracion = usuario.data.valoracion;
                setValoracion(valoracion);
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

        const usuario = await api2.get(`usuarios/${emailVendedor}`);
        if(!usuario){
          console.error('No hay reseñas');
        }
        setUsuario(usuario);

        const resenas = usuario.data.resenas;
        setResenas(resenas);

        const valoracion = usuario.data.valoracion;
        setValoracion(valoracion);
    
        setNota(1);
        setDescripcion('');
    };

    const indexOfLastResena = currentPage * resenasPerPage;
    const indexOfFirstResena = indexOfLastResena - resenasPerPage;
    const currentResenas = resenas.slice(indexOfFirstResena, indexOfLastResena);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(resenas.length / resenasPerPage); i++) {
      pageNumbers.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
          {i}
        </Pagination.Item>
      );
    }

    return (
      <div className="valorar-perfil-container">
        {usuario && (
          <div className="profile-container">
            <div className="profile-info">
              <p id="nombre-apellido" >{`${nombre} ${apellido}`}</p> 
              <p id="valoracion">{`${valoracion} ⭐`}</p>   
            </div>
          </div>
        )}
        <div className="centered-sections">
            <h2>Añadir Nueva Reseña</h2>
            <form onSubmit={handleSubmitResena}>
              <div>
                <label id='nota'>
                  Nota:
                  <select
                    id='notaInput'
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((numero) => (
                      <option key={numero} value={numero}>
                        {numero}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label id='descripcion'>
                  Descripción:
                  <textarea
                    type="text"
                    id='descripcionInput'
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <button type="submit" style={{marginBottom: '20px'}}>Agregar Reseña</button>
              </div>
            </form>
          
          
          <h2>Lista de Reseñas</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nota</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {currentResenas.map((resena, index) => (
              <tr key={index}>
                <td>{resena.nota}</td>
                <td>{resena.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination>{pageNumbers}</Pagination>
        </div>
      </div>
    );
};

export default ValorarPerfil;