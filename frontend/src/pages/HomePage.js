import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bannerImg from '../assets/Banner-img.jpg'; // ✅ import from src/assets

const HomePage = () => {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const filteredProducts = products.filter(p => {
    const matchesTitle = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesTitle && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        toast.error('Failed to load products');
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully ✅');
    navigate('/');
  };

  const handleCategoryClick = (cat) => {
    navigate(`/category/${cat}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">Desi-Etsy 🧵</h1>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/cart" className="hover:underline">🛒 Cart</Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="font-medium hover:underline"
              >
                👋 {user.name} ▾
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">📦 My Orders</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </nav>
      </header>

      {/* Banner */}
      <div
        className="relative bg-cover bg-center h-60 md:h-96"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">Not Just Handmade. Heartmade.</h2>
          <p className="mb-4 max-w-md">Explore art you can feel — straight from the hands of India’s finest creators. 🧵🎨</p>
          <button onClick={() => navigate('/cart')} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-white">
            Shop Now
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-8">
        <h3 className="text-xl font-semibold mb-4">🧵 Top Categories</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(cat)}
              className="bg-white border rounded px-4 py-2 shadow transition-transform duration-300 hover:scale-105 hover:bg-orange-100"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="px-4">
        <h3 className="text-xl font-semibold mb-4">✨ Featured Products</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(showAll ? filteredProducts : filteredProducts.slice(0, 8)).map(p => (
            <div
              key={p._id}
              className="bg-white rounded shadow overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold text-lg">{p.title}</h4>
                <p className="text-sm text-gray-600">{p.category}</p>
                <p className="text-orange-600 font-bold mt-2">₹{p.price}</p>
                <Link
                  to={`/product/${p._id}`}
                  className="mt-2 inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 rounded"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length > 8 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              {showAll ? 'Show Less' : 'View All Products'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white text-center text-sm text-gray-600 py-6 mt-12">
        <p>© 2025 Desi-Etsy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
