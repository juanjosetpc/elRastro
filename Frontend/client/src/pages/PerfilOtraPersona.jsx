import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Pagination } from 'react-bootstrap';
import api2 from '../services/api2';
import { useParams } from 'react-router-dom';
import "../styles/ValorarPerfil.css";

const PerfilOtraPersona = () => {
    const {emailVendedor} = useParams();
    const [usuario, setUsuario] = useState(null);
    const [valoracion, setValoracion] = useState(0);
    const [resenas, setResenas] = useState([]);
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
                <div className="left-info">
                  <p id="nombre-apellido">{`${nombre} ${apellido}`}</p>
                </div>
                <div className="right-info">
                  <p id="valoracion" style={{ whiteSpace: 'nowrap' }}>{`${valoracion} ⭐`}</p>
                </div>   
            </div>
          </div>
        )}
        <div className="centered-sections">        
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

export default PerfilOtraPersona;