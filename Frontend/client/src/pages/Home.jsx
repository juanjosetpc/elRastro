import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Home.css"
import ProductCard from '../components/ProductCard';
import api2 from '../services/api2';
import MapaMultiple from '../components/MapaMultiple';

const Home = ({propEmail}) => {
  const [productos, setProductos] = useState([]);
  const [searchDescr, setSearchDescr] = useState('');
  const [searchVendedor, setSearchVendedor] = useState('');
  const [fechaFinOrd, setFechaFinOrd] = useState('');
  const [filtrarMapa, setFiltrarMapa] = useState(false);
  const [direcciones, setDirecciones] = useState([]);

  const fetchProductos = async () => {
    try {
      let endpoint = `/productos/ensubasta/`;
      const queryParams = [];

      if(propEmail){
        endpoint+=`${propEmail}`;
      }

      if (searchDescr) {
        queryParams.push(`descripcion=${searchDescr}`);
      }
      if (searchVendedor) {
        queryParams.push(`email=${searchVendedor}`);
      }
      if (fechaFinOrd) {
        queryParams.push(`fechaFin=${fechaFinOrd}`);
      }

      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join("&")}`;
      }

      const { data } = await api2.get(endpoint);
      setProductos(data);
      
      if(searchDescr || searchVendedor){
        const direccionesArray = data.map((producto) => producto.direccion);
        setDirecciones(direccionesArray);
      }
      
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (searchDescr || searchVendedor) {
      setFiltrarMapa(true);
      fetchProductos();
    } else {
      fetchProductos();
      setFiltrarMapa(false);
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <h1>Productos</h1>
        <form onSubmit={handleFilterSubmit}>
          <label htmlFor="search-desc">Busca por descripción:</label>
          <input
            id="search-desc"
            type="text"
            placeholder="descripcion"
            value={searchDescr}
            onChange={(e) => setSearchDescr(e.target.value)}
          />
          <label htmlFor="search-seller">Busca por vendedor:</label>
          <input
            id="search-seller"
            type="text"
            placeholder="vendedor"
            value={searchVendedor}
            onChange={(e) => setSearchVendedor(e.target.value)}
          />
          <label htmlFor="sort-date">Orden fecha fin:</label>
          <select
            id="sort-date"
            value={fechaFinOrd}
            onChange={(e) => setFechaFinOrd(e.target.value)}
          >
            <option value=""></option>
            <option value="1">Ascendente</option>
            <option value="-1">Descendente</option>
          </select>
          <button type="submit">Filtrar</button>
        </form>
        <span className="divisor"></span>
        <div className="products">
          <div className="product-grid">
            {productos.map((producto) => (
              <Link
                className="no-underline"
                to={`/product/${producto._id}`}
                key={producto._id}
              >
                <ProductCard producto={producto} />
              </Link>
            ))}
          </div>

          {filtrarMapa && direcciones.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                width: "55%",
                marginLeft: "auto",
                marginRight: "auto",
                border: "2px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <MapaMultiple
                filtrarMapa={filtrarMapa}
                direcciones={direcciones}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
