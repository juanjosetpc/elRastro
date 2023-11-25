import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
import api2 from '../services/api2';

const Perfil = ({ propEmail }) => {
  const [productosNoEnVenta, setProductosNoEnVenta] = useState([]);
  const [productosEnVenta, setProductosEnVenta] = useState([]);
  const [productosPujando, setProductosPujando] = useState([]);
  const [activeTab, setActiveTab] = useState('noEnVenta');
  const [operacionExitosa, setOperacionExitosa] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');
  const [redirectEditar, setRedirectEditar] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos del usuario que no están en venta
        const productosNoEnVenta = await api2.get(`productos/ofertados/${propEmail}?activo=false`);
        setProductosNoEnVenta(productosNoEnVenta.data);

        // Obtener productos del usuario que están en venta
        const productosEnVenta = await api2.get(`/productos/ofertados/${propEmail}?activo=true`);
        setProductosEnVenta(productosEnVenta.data);

        // Obtener productos por los cuales el usuario está pujando
        const productosPujando = await api2.get(`/productos/comprando/${propEmail}`);
        setProductosPujando(productosPujando.data);

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

  
  const handleEditar = (productoId) => {
    setRedirectEditar(`/editar-producto/${productoId}`);
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
          </ul>

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
        </div>
      </div>
    </div>
  );
};

export default Perfil;
