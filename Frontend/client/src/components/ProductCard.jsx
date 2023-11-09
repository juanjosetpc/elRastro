import {useState} from 'react';


export function ProductCard(props) {

    return (
      <div className="product-card">
        <img src={product.image} alt={product.title} />
        <h3>{product.title}</h3>
        <p>{product.description}</p>
      </div>
    );

}