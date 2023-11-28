import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {Table, Pagination} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
import api2 from '../services/api2';
import "../styles/ValorarPerfil.css";
import { useNavigate } from 'react-router-dom';


const Perfil = ({ propEmail }) => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [productosNoEnVenta, setProductosNoEnVenta] = useState([]);
  const [productosEnVenta, setProductosEnVenta] = useState([]);
  const [productosPujando, setProductosPujando] = useState([]);
  const [productosComprados, setProductosComprados] = useState([]);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [valoracion, setValoracion] = useState(0);
  const [resenas, setResenas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resenasPerPage = 5;
  const [activeTab, setActiveTab] = useState('noEnVenta');
  const [operacionExitosa, setOperacionExitosa] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuario = await api2.get(`usuarios/${propEmail}`);
        setUsuario(usuario);
        // Obtener productos del usuario que no están en venta
        const productosNoEnVenta = await api2.get(`productos/ofertados/${propEmail}?activo=false`);
        setProductosNoEnVenta(productosNoEnVenta.data);

        // Obtener productos del usuario que están en venta
        const productosEnVenta = await api2.get(`/productos/ofertados/${propEmail}?activo=true`);
        setProductosEnVenta(productosEnVenta.data);

        // Obtener productos por los cuales el usuario está pujando
        const productosPujando = await api2.get(`/productos/comprando/${propEmail}`);
        setProductosPujando(productosPujando.data);

        const productosVendidos = await api2.get(`/productos/vendidos/${propEmail}`);
        setProductosVendidos(productosVendidos.data);
        
        const productosComprados = await api2.get(`/productos/comprados/${propEmail}`);
        setProductosComprados(productosComprados.data);

        const nombre = usuario.data.nombre;
        setNombre(nombre);

        const apellido = usuario.data.apellido;
        setApellido(apellido);

        const resenas = usuario.data.resenas;
        if(!resenas){
          console.error('No hay reseñas');
        }
        setResenas(resenas);

        const valoracion = usuario.data.valoracion;
        setValoracion(valoracion);

        if (operacionExitosa) {
          setShowToast(true);
          setMensajeToast("Operación exitosa");
          setTimeout(() => {
            setShowToast(false);
            setOperacionExitosa(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchData();
  }, [propEmail, operacionExitosa]);

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


  const handleEditar = (productoId) => {
      // Crear una URL con el ID del producto para redirigir al formulario de edición
      const url = `/editar-producto/${productoId}`;
      // Navegar a la URL
      navigate(url);
  };
  
  

  const handlePonerEnSubasta = async (productoId) => {
    try {
      const response = await api2.put(`/productos/activar/${productoId}`);
      setOperacionExitosa(true); 
      setShowToast(true);
    } catch (error) {
      console.error('Error al activar el producto:', error);
    }
  };

  const handleEliminar = async (productoId) => {
    try {
      const response = await api.delete(`/productos/${productoId}`);
      if(response.status === 204){
        setOperacionExitosa(true);
        setShowToast(true);        
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setShowToast(true);
        setMensajeToast(error.response.data.error);
      }
      console.error('Error al eliminar el producto:', error);
    }
  };

  

  return (
    <div className="container mt-5">
      <ToastContainer
        className="p-3"
        position="bottom-end"
        style={{ zIndex: 1 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={operacionExitosa ? "success" : "danger"}
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-3 ms-auto"
              alt=""
            />
          </Toast.Header>
          <Toast.Body className={"text-white"}>{mensajeToast}</Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="row">
        <div className="col-md-3">
          {/* Enlace para revisar chats */}
          <Link to={`/chats/${propEmail}`}><button class="btn btn-primary">Chats</button></Link>
        </div>
        <div className="col-md-9">
          <ul className="nav nav-tabs">
          <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "misDatos" ? "active" : ""
                }`}
                onClick={() => setActiveTab("misDatos")}
              >
                Mis datos
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "noEnVenta" ? "active" : ""
                }`}
                onClick={() => setActiveTab("noEnVenta")}
              >
                No en Venta
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "enVenta" ? "active" : ""
                }`}
                onClick={() => setActiveTab("enVenta")}
              >
                En Venta
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "pujando" ? "active" : ""
                }`}
                onClick={() => setActiveTab("pujando")}
              >
                Pujando
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "vendidos" ? "active" : ""
                }`}
                onClick={() => setActiveTab("vendidos")}
              >
                Vendidos
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "comprados" ? "active" : ""
                }`}
                onClick={() => setActiveTab("comprados")}
              >
                Comprados
              </button>
            </li>
          </ul>

          {activeTab === "misDatos" && (
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
                    <div className="profile-address">
                      <p id="direccion">{`Dirección: ${usuario.data.calle}`}, {`${usuario.data.codigoPostal}`}, {`${usuario.data.ciudad}`}</p>
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
          )}

          {activeTab === "noEnVenta" && (
            <div>
              <h2>Productos no en venta</h2>
              <Table responsive bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Precio Actual</th>
                    <th>Poner en subasta</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {productosNoEnVenta.map((producto) => (
                    <tr key={producto._id}>
                      <td>
                        <Link
                          to={`/product/${producto._id}`}
                          key={producto._id}
                        >
                          {producto.titulo}
                        </Link>
                      </td>
                      <td>
                        <p>
                          {producto.pujaMayor === 0
                            ? producto.precioInicio
                            : producto.pujaMayor}
                          €
                        </p>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handlePonerEnSubasta(producto._id)}
                        >
                          Activar
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleEliminar(producto._id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {activeTab === "enVenta" && (
            <div>
              <h2>Productos en venta</h2>
              <Table responsive bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Precio Actual</th>
                    <th>Editar</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {productosEnVenta.map((producto) => (
                    <tr key={producto._id}>
                      <td>
                        <Link
                          to={`/product/${producto._id}`}
                          key={producto._id}
                        >
                          {producto.titulo}
                        </Link>
                      </td>
                      <td>
                        <p>
                          {producto.pujaMayor === 0
                            ? producto.precioInicio
                            : producto.pujaMayor}
                          €
                        </p>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleEditar(producto._id)}
                        >
                          Editar
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleEliminar(producto._id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {activeTab === "pujando" && (
            <div>
              <h2>Productos pujando</h2>
              <Table responsive bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Precio actual</th>
                    <th>Fecha de cierre</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPujando.map((producto) => (
                    <tr key={producto._id}>
                      <td>
                        <Link
                          to={`/product/${producto._id}`}
                          key={producto._id}
                        >
                          {producto.titulo}
                        </Link>
                      </td>
                      <td><p>{producto.pujaMayor}€</p></td>
                      <td>{producto.fechaFin}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {activeTab === "vendidos" && (
            <div>
              <h2>Productos vendidos sin valorar</h2>
              <Table responsive bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Valorar comprador</th>
                  </tr>
                </thead>
                <tbody>
                  {productosVendidos.map((producto) => (
                    <tr key={producto._id}>
                      <td>
                        <p>{producto.titulo}</p>
                      </td>
                      <td><Link to={`/valorarPerfil/${producto.emailComprador}/${producto._id}`}>
                        <button>Valorar</button>
                      </Link></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {activeTab === "comprados" && (
            <div>
              <h2>Productos comprados sin valorar</h2>
              <Table responsive bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Valorar vendedor</th>
                  </tr>
                </thead>
                <tbody>
                  {productosComprados.map((producto) => (
                    <tr key={producto._id}>
                      <td>
                        <p>{producto.titulo}</p>
                      </td>
                      <td><Link to={`/valorarPerfil/${producto.emailVendedor}/${producto._id}`}>
                        <button>Valorar</button>
                      </Link></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Perfil;
