import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import api2 from '../services/api2';
import axios from "axios";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/CreateProduct.css";


export const CreateProduct = ({propEmail}) => {
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

const [usuario, setUsuario] = useState(null);

const { productoId } = useParams();

useEffect(() => {
  const fetchData = async () => {
    try {
      // Obtener los detalles del producto utilizando el ID
      const response = await api.get(`/productos/${productoId}`);
      const product = response.data;

      const usuario = await api2.get(`usuarios/${propEmail}`);
      setUsuario(usuario);

      // Llenar el estado del producto con los datos recuperados
      setProduct({
        emailVendedor: product.emailVendedor,
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
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Solo cargar datos del producto si se proporciona un productoId válido
  if (productoId) {
    fetchData();
  }
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
        `http://localhost:5000/api/v1/productos/${productoId}`,
        product
      );

      if (response.status === 200) {
        console.log('Producto actualizado con éxito:', response.data);
        alert('Producto actualizado con éxito');
        navigate('/');
      }
    } else {
      // Crear un nuevo producto
      const response = await api.post(
        'http://localhost:5000/api/v1/productos/',
        product
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
          Email del vendedor: {propEmail}
          
        </label>

        <br/><br/>

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
          Título<span style={{ fontWeight: 'bold' }}>*</span>
          {' '}
          <input
            type = "text"
            name= "titulo"
            value = {product.titulo}
            onChange={handleInputChange}
            required
          />
        </label>

        <br/>
        <br/>
  
        <label style={{ display: 'flex', flexDirection: 'column' }}>
         Descripción *
         <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <textarea
            name="descripcion"
            value={product.descripcion}
           onChange={handleInputChange}
            style={{ marginLeft: '2px', flexGrow: 1 }}
            required
         />
        </div>
          </label>
        <br/>
        <br/>


        <label>
          Fecha de fin <span style={{ fontWeight: 'bold' }}>*</span>
          {' '}
          <input 
            type="date"
            name="fechaFin"
            value={product.fechaFin}
            onChange={handleInputChange}
            required
          />
        </label>
        <br/>
        <br/>
        <label>
          Precio de inicio <span style={{ fontWeight: 'bold' }}>*</span>
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
        Imágenes
        {' '}
      
        <input
          type="file"
          name="fotos"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
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