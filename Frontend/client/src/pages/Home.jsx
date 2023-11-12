import React from 'react';
import ProductList from '../components/ProductList';
import Navbar from '../components/Navbar';
const Home = () => {
  return (
    <div>
      <Navbar/>
      <h1>Productos</h1>
      <ProductList />
    </div>
  );
};

export default Home;