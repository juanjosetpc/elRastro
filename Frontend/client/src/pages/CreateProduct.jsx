import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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

const handleFileChange = (e) => {
  const files = e.target.files;
  const photosArray = Array.from(files);

  // Convertir las imágenes a base64
  const promises = photosArray.map((photo) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.readAsDataURL(photo);
    });
  });

  Promise.all(promises).then((base64Images) => {
    setProduct({
      ...product,
      fotos: base64Images,
    });
  });
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
          Email del vendedor<span style={{ color: 'red' }}> *</span>
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
         Dirección (calle, codigo postal y ciudad)<span style={{ color: 'red' }}> *</span>
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
      
      <small>Los campos marcados con <span style={{ color: 'red' }}>*</span> son obligatorios</small>
      <br/>
      <br/>

      <button type="submit">Crear producto</button>
      </form>


    </div>
  );
};

export default CreateProduct;