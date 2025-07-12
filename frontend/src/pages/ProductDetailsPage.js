import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { cartItems, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error('Failed to load product');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const alreadyInCart = cartItems.some(item => item._id === product?._id);

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
      addToCart({ ...product, quantity });
      toast.success('Added to cart 🛒');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white rounded-lg shadow-lg p-6">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.title || 'Product image'}
          className="w-full h-[400px] object-cover rounded-lg border"
        />

        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{product.title || 'Untitled Product'}</h2>
          <p className="text-indigo-600 font-medium text-lg">{product.category || 'Unknown Category'}</p>

          {/* ⭐ Rating Demo */}
          <div className="flex items-center gap-1 text-yellow-500 text-xl">
            {'⭐'.repeat(product.rating || 4)}
            <span className="text-sm text-gray-500 ml-2">({product.rating || 4}/5)</span>
          </div>

          <p className="text-xl text-gray-800 font-semibold">₹{product.price || 0}</p>
          <p className="text-gray-700">{product.description || 'No description provided.'}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="quantity" className="font-medium">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              aria-label="Add product to cart"
              className={`px-6 py-2 rounded text-white font-semibold transition duration-200 ${
                alreadyInCart ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {alreadyInCart ? 'Already in Cart' : 'Add to Cart 🛒'}
            </button>

            <button
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user'));
              if (!user) {
                toast.info('Please login to continue');
                navigate('/login');
                return;
              }

              if (!alreadyInCart) {
                addToCart({ ...product, quantity });
                toast.success('Added to cart 🛒');
              }

              navigate('/cart');
            }}
            className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200"
          >
            Shop Now 🛍️
          </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ProductDetailsPage;
