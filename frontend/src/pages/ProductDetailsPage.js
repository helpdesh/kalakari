import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
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
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (alreadyInCart) {
      toast.warn('Product already in cart');
    } else {
      addToCart({ ...product, quantity });
      toast.success('Added to cart');
    }
  };

  const handleReviewSubmit = async () => {
    if (!userRating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/products/${id}/review`,
        { rating: userRating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Review submitted!');
      setUserRating(0);
      setComment('');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    }
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        onClick={() => setUserRating(i + 1)}
        className={`cursor-pointer text-2xl ${
          i < userRating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white rounded-lg shadow-lg p-6">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.title}
          className="w-full h-[400px] object-contain rounded-lg border"
        />

        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <p className="text-indigo-600 font-medium text-lg">{product.category}</p>

          <div className="flex items-center gap-1 text-yellow-500 text-xl">
            {'⭐'.repeat(product.rating || 4)}
            <span className="text-sm text-gray-500 ml-2">
              ({product.rating?.toFixed(1) || 4}/5)
            </span>
          </div>

          <p className="text-xl text-gray-800 font-semibold">₹{product.price}</p>
          <p className="text-gray-700">{product.description}</p>

          {user && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-bold mb-2">Rate this Product</h3>
              <div className="flex items-center mb-2">{renderStars(userRating)}</div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment (optional)"
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <button
                onClick={handleReviewSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Submit Review
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label htmlFor="quantity" className="font-medium">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className={`px-6 py-2 rounded text-white font-semibold transition duration-200 ${
                alreadyInCart ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {alreadyInCart ? 'Already in Cart' : 'Add to Cart 🛒'}
            </button>

            <button
              onClick={() => {
                if (!user) {
                  toast.info('Please login to continue');
                  navigate('/login');
                  return;
                }

                if (!alreadyInCart) {
                  addToCart({ ...product, quantity });
                  toast.success('Added to cart');
                }

                navigate('/cart');
              }}
              className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Shop Now 🛍️
            </button>
          </div>
        </div>
      </div>

      {/* Show all reviews */}
      <div className="mt-10 max-w-4xl mx-auto bg-white rounded shadow p-6">
        <h3 className="text-xl font-bold mb-4">User Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((rev, idx) => (
            <div key={idx} className="mb-4 border-b pb-3">
              <div className="flex items-center gap-2 text-yellow-500 text-lg">
                {'★'.repeat(rev.rating)}{' '}
                <span className="text-sm text-gray-600 ml-2">({rev.rating}/5)</span>
              </div>
              {rev.comment && <p className="text-gray-700 mt-1">{rev.comment}</p>}
              <p className="text-xs text-gray-400 mt-1">By {rev.user?.name || 'Anonymous'}</p>
            </div>
          ))
        )}
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ProductDetailsPage;
