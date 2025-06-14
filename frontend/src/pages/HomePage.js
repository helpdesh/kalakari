import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesTitle = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesTitle && matchesCategory;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchApproved = async () => {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    };
    fetchApproved();
  }, []);

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <h1>Desi-Etsy 🧵</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">🛒 Cart</Link>
          {user ? (
            <>
              <span style={{ marginRight: '1rem', fontWeight: '500' }}>
                👋 {user.name}
              </span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#cc5200', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      {/* Banner */}
      <div className="banner">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h2>Not Just Handmade. Heartmade.</h2>
          <p>Explore art you can feel — straight from the hands of India’s finest creators. 🧵🎨</p>
          <button className="banner-btn" onClick={() => navigate('/cart')}>Shop Now</button>
        </div>
      </div>

      {/* Top Categories */}
      <div className="top-categories">
        <h3>🧵 Top Categories</h3>
        <div className="category-grid">
          <div className="category-card">Home Decor</div>
          <div className="category-card">Handmade Jewelry</div>
          <div className="category-card">Kitchen</div>
          <div className="category-card">Storage</div>
          <div className="category-card">Wood Craft</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid-container">
        {(showAll ? filteredProducts : filteredProducts.slice(0, 8)).map(p => (
          <div className="card" key={p._id}>
            <img src={p.image} alt={p.title} />
            <div className="card-content">
              <h4>{p.title}</h4>
              <p>{p.category}</p>
              <p className="price">₹{p.price}</p>
              <Link to={`/product/${p._id}`} className="view-btn">View Product</Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {filteredProducts.length > 8 && !showAll && (
        <div className="view-all-container">
        <button className="view-all-btn" onClick={() => setShowAll(true)}>
        View All Products
      </button>
        </div>
    )}
      {showAll && (
        <div className="view-all-container">
          <button className="view-all-btn" onClick={() => setShowAll(false)}>
            Show Less
          </button>
        </div>
      )}
    

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h4>Desi-Etsy</h4>
          <p>Empowering local artisans across India 🇮🇳</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
          <p className="copyright">© 2025 Desi-Etsy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
