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
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      toast.error('Please provide both rating and comment');
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/products/${id}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(data);
      setRating('');
      setComment('');
      toast.success('Review submitted!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
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
            <span className="text-sm text-gray-500 ml-2">({product.rating || 4}/5)</span>
          </div>

          <p className="text-xl text-gray-800 font-semibold">₹{product.price}</p>
          <p className="text-gray-700">{product.description}</p>

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

      {/* Reviews Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Customer Reviews 📝</h3>

        {product.reviews?.length ? (
          <div className="space-y-4">
            {product.reviews.map((rev, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded shadow">
                <p className="font-semibold">{rev.name}</p>
                <p className="text-yellow-500">{'⭐'.repeat(rev.rating)}</p>
                <p className="text-sm text-gray-700">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {user && (
          <form onSubmit={handleSubmitReview} className="mt-6 bg-white p-4 rounded shadow space-y-2">
            <h4 className="font-medium">Leave a Review</h4>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">Select rating</option>
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your thoughts..."
              rows="3"
              className="w-full border px-2 py-1 rounded"
            ></textarea>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ProductDetailsPage;
