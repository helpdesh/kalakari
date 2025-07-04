import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../index.css';
const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { cartItems, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-8 text-gray-500 text-center">Loading product...</p>;

  const alreadyInCart = cartItems.some(item => item._id === product._id);

    const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (alreadyInCart) {
      toast.warn('Product already in cart!');
    } else {
      addToCart(product);
      toast.success('Added to cart 🛒');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white rounded-lg shadow-lg p-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[400px] object-cover rounded-lg border"
        />

        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <p className="text-indigo-600 font-medium text-lg">{product.category}</p>
          <p className="text-xl text-gray-800 font-semibold">₹{product.price}</p>
          <p className="text-gray-700">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className={`mt-4 px-6 py-2 rounded text-white font-semibold ${
              alreadyInCart ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {alreadyInCart ? 'Already in Cart' : 'Add to Cart 🛒'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
