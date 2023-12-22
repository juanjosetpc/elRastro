import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import api2 from '../services/api2';
import axios from "axios";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/CreateProduct.css";


export const ActivateProduct = ({propEmail}) => {
  const cloudinary_cloud = process.env.REACT_APP_CLOUDINARY_CLOUD;
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    emailVendedor: propEmail,
    direccion: '',
    titulo: '',
    descripcion: '',
    precioInicio: 0,
    fotos: [],
    fechaFin: '',
    enSubasta: false,
    pujaMayor: 0,
    emailComprador: null,
});

// const [usuario, setUsuario] = useState(null);

const { productoId } = useParams();

useEffect(() => {
  const fetchData = async () => {
    try {
      if (productoId) {
        // Obtener los detalles del producto utilizando el ID
        const response = await api.get(`/productos/${productoId}`, {  headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`}
        });
        const product = response.data;

        // Restablecer el estado del producto con los datos recuperados
        setProduct({
          emailVendedor: propEmail,
          direccion: product.direccion,
          titulo: product.titulo,
          descripcion: product.descripcion,
          fechaInicio: product.fechaInicio,
          precioInicio: product.precioInicio,
          fotos: product.fotos,
          fechaFin: product.fechaFin,
          enSubasta: product.enSubasta,
          pujaMayor: product.pujaMayor,
          emailComprador: product.emailComprador,
        });
      }

    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  fetchData();
}, [productoId]);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setProduct({
    ...product,
    [name]: value,
  });
};


const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const today = new Date();
      const selectedEndDate = new Date(product.fechaFin);

      if (selectedEndDate <= today) {
        alert('La fecha de fin debe ser posterior a la fecha actual.');
        return;
      }

    if (productoId) {
      // Actualizar el producto existente
      const response = await api.put(
        `/productos/${productoId}`,
        product,
        {  headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`}
        }
      );

      try {
        const response = await api2.put(`/productos/activar/${productoId}`, {} , {  
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        
      } catch (error) {
        console.error('Error al activar el producto:', error);
      }

      if (response.status === 200) {
        console.log('Producto activado con éxito:', response.data);
        alert('Producto activado con éxito');
        navigate('/');
      }
    } 
  } catch (error) {
    console.error('Error al procesar el formulario', error);
    
    if(product.pujaMayor > 0){
      alert("No se pueden editar los datos de un producto que tiene pujas activas.");
    }else{
      alert(
        'Hubo un error al procesar el formulario. Por favor, inténtalo de nuevo.'
      );
    }
  }
};


  return (
    <div className="createProductContainer">
      <div className="createProductForm">
      <h2>Activar producto</h2>
      <br></br>

      <form onSubmit={handleSubmit}>

      <label>
          
         <span style={{ fontWeight: 'bold' }}>Email del vendedor: </span> {propEmail}
          
        </label>

        <br/><br/>

        <label>
          <span style={{ fontWeight: 'bold' }}>Título: </span> {product.titulo}
        </label>
        <br/><br/>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 'bold' }}>Descripción: </span> {product.descripcion} 
        <br/>
        <br/>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column' }}>

         <span style={{ fontWeight: 'bold' }}>Dirección (calle, código postal y ciudad): </span>
          {product.direccion}
        </label>
        <br/>
        <label>
          <span style={{ fontWeight: 'bold' }}>Fecha de fin  *</span><br/>
          {' '}
          <input 
            type="datetime-local"
            name="fechaFin"
            value={product.fechaFin}
            onChange={handleInputChange}
            required
          />
        </label>
        <br/>
        <br/>
        <label>
         <span style={{ fontWeight: 'bold' }}> Precio de inicio: </span> {product.precioInicio}<br/>
        </label>
        <br/>
        <br/>

      <button type="submit" className="createProductButton">
          Activar producto
        </button>
      </form>
      </div>
    </div>
  );
};

export default ActivateProduct;