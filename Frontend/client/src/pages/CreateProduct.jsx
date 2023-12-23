import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
// import api2 from '../services/api2';
import axios from "axios";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/CreateProduct.css";


export const CreateProduct = ({propEmail}) => {
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
          fechaFin: product.fechaFin.slice(0, -5),
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

const handleFileChange = async (e) => {
  const files = e.target.files;
  const photosArray = Array.from(files);
  console.log(cloudinary_cloud);

  // Cargar imágenes directamente a Cloudinary
  const uploaders = photosArray.map(async (photo) => {
    const formData = new FormData();
    formData.append("file", photo);
    formData.append("upload_preset", "elRastro");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinary_cloud}/image/upload`,
        formData
      );

      // Agregar la URL de la imagen al array de fotos en el estado del producto
      setProduct((prevProduct) => ({
        ...prevProduct,
        fotos: [...prevProduct.fotos, response.data.secure_url],
      }));
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary", error);
    }
  });

  // Esperar a que todas las imágenes se carguen
  await Promise.all(uploaders);
};


const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    if (product.precioInicio <= 0) {
      alert('El precio inicial debe ser mayor que 0.');
      return;
    }

    const today = new Date();
      const selectedEndDate = new Date(product.fechaFin);

      if (selectedEndDate <= today) {
        alert('La fecha de fin debe ser posterior a la fecha actual.');
        return;
      }

    if (product.emailVendedor.trim() === '') {
      alert('Por favor, ingresa el correo electronico.');
      return;
    } else if (product.direccion.trim() === '') {
      alert('Por favor, introduzca una direccion.');
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

      if (response.status === 200) {
        console.log('Producto actualizado con éxito:', response.data);
        alert('Producto actualizado con éxito');
        navigate('/');
      }
    } else {
      // Crear un nuevo producto
      const response = await api.post(
        '/productos',
        product,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }},
      );

      if (response.status === 201) {
        console.log('Producto creado con éxito:', response.data);
        alert('Producto creado con exito');
        navigate('/perfil');
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
      <h2>{productoId ? 'Editar producto' : 'Crear producto'}</h2>
      <br></br>

      <form onSubmit={handleSubmit}>

      <label>
          
         <span style={{ fontWeight: 'bold' }}>Email del vendedor: </span> {propEmail}
          
        </label>

        <br/><br/>

        <label>
          <span style={{ fontWeight: 'bold' }}>Título *</span><br/>
          {' '}
          <input
            type = "text"
            name= "titulo"
            value = {product.titulo}
            onChange={handleInputChange}
            required
          />
        </label>
        <br/><br/>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 'bold' }}>Descripción *</span>
         
         <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <textarea
            name="descripcion"
            value={product.descripcion}
           onChange={handleInputChange}
            style={{ marginLeft: '2px', flexGrow: 1 }}
            required
         />
          </div>
        <br/>

          </label>
          <label style={{ display: 'flex', flexDirection: 'column' }}>

         <span style={{ fontWeight: 'bold' }}>Dirección (calle, código postal y ciudad) *</span>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <input type="text"
            name="direccion"
            value={product.direccion}
            onChange={handleInputChange}
            style={{ marginLeft: '2px', flexGrow: 1 }}
            required
          />

            </div>
        </label>
        <br/>
        
        <label>
         <span style={{ fontWeight: 'bold' }}> Precio de inicio  *</span><br/>
          {' '}
          <input 
            type="number"
            name="precioInicio"
            value={product.precioInicio}
            onChange={handleInputChange}
            required
          />
        </label>
        

        <br/>
        <br/>

      <label>
         <span style={{ fontWeight: 'bold' }}>Imágenes</span><br/>
        {' '}
      
        <input
          type="file"
          name="fotos"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      <br/>
      <br/>
        <p style={{ color: 'red' }}><span style={{ fontWeight: 'bold' }}>IMPORTANTE:</span> Las imágenes seleccionadas serán subidas a Cloudinary</p>
      </label>
      <br/> 
      <small>Los campos marcados con <span style={{ fontWeight: 'bold' }}>*</span> son obligatorios</small>
  
      <br/>
      <br/>

      <button type="submit" className="createProductButton">
          {productoId ? 'Actualizar datos' : 'Crear producto'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default CreateProduct;