import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from "axios";


export const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    emailVendedor: '',
    direccion: '',
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    precioInicio: 0,
    fotos: [],
    fechaFin: null,
    enSubasta: false,
    pujaMayor: 0,
    emailComprador: null,
});

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

  // Cargar imágenes directamente a Cloudinary
  const uploaders = photosArray.map(async (photo) => {
    const formData = new FormData();
    formData.append("file", photo);
    formData.append("upload_preset", "elRastro");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ddfymuj4y/image/upload",
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
    
    if((product.emailVendedor.trim() === '')){
      alert("Por favor, ingresa el correo electronico.");
      return;
    }else if(product.direccion.trim() === ''){
      alert("Por favor, introduzca una direccion.");
      return;
    }

    // Enviar el producto al backend
    const response = await api.post('http://localhost:5000/api/v1/productos/', product);

    if (response.status === 201) {
      console.log('Producto creado con éxito:', response.data);
      alert("Producto creado con exito");
      navigate("/");
    }
    

  } catch (error) {
    console.error('Error al crear el producto', error);
    alert('Hubo un error al crear los productos. Por favor, inténtalo de nuevo.');
  }
};


  return (
    <div>
      <h2>Crear producto</h2>
      <br></br>

      <form onSubmit={handleSubmit}>
        <label>
          Email del vendedor<span style={{ fontWeight: 'bold' }}>*</span>
          {' '}
          <input
            type = "email"
            name= "emailVendedor"
            value = {product.emailVendedor}
            onChange={handleInputChange}
            required
          />
        </label>

        <br/>
        <br/>

        <label>
         Dirección (calle, codigo postal y ciudad)<span style={{ fontWeight: 'bold' }}>*</span>
          {' '}
          <input type="text"
            name="direccion"
            value={product.direccion}
            onChange={handleInputChange}
            required
          />
        </label>
        <br/><br/>
        <label>
          Título
          {' '}
          <input
            type = "text"
            name= "titulo"
            value = {product.titulo}
            onChange={handleInputChange}
          />
        </label>

        <br/>
        <br/>
  
        <label>
        Descripción    <br/>
        <textarea
            name="descripcion"
            value={product.descripcion}
            onChange={handleInputChange}
          />
        </label>
        <br/>
        <br/>


        <label>
          Fecha de inicio
          {' '}
          <input 
            type="date"
            name="fechaInicio"
            value={product.fechaInicio}
            onChange={handleInputChange}
          />
        </label>
        <br/>
        <br/>
        <label>
          Precio de inicio
          {' '}
          <input 
            type="number"
            name="precioInicio"
            value={product.precioInicio}
            onChange={handleInputChange}
          />
        </label>
        

        <br/>
        <br/>

      <label>
        Fotos
        <p style={{ color: 'red' }}><span style={{ fontWeight: 'bold' }}>IMPORTANTE:</span> Las imágenes seleccionadas serán subidas a Cloudinary</p>
        {' '}
        <input
          type="file"
          name="fotos"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

      </label>
      <br/>
      <br/>
      
      <small>Los campos marcados con <span style={{ fontWeight: 'bold' }}>*</span> son obligatorios</small>
      <br/>
      <br/>

      <button type="submit">Crear producto</button>
      </form>


    </div>
  );
};

export default CreateProduct;