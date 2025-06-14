import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailsPage.css';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';


const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p style={{ padding: '2rem' }}>Loading product...</p>;

  return (
    <div className="product-details">
      <div className="product-box">
        <img src={product.image} alt={product.title} />
        <div className="info">
          <h2>{product.title}</h2>
          <p className="category">{product.category}</p>
          <p className="price">₹{product.price}</p>
          <p>{product.description}</p>
          <button
          className="cart-btn" onClick={() => {const alreadyAdded = cartItems.some(item => item._id === product._id);
          if (alreadyAdded) {
               toast.warn('Product already in cart!');
          } else {
               addToCart(product);
               toast.success('Added to cart 🛒');
               }
          }}>
          Add to Cart
          </button>


        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
