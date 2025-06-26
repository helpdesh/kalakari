import React, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CategoryPage.css';


const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost:5000/api/products');
      const filtered = categoryName === 'all'
        ? res.data
        : res.data.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
      setProducts(filtered);
    };
    fetch();
  }, [categoryName]);

  return (
    <div className="category-page">
      <button
        onClick={() => navigate('/')}
        className="back-btn"
      >
        ← Back to Home
      </button>

      <h2>{categoryName === 'all' ? 'All Products' : `${categoryName} Collection`}</h2>
      <div className="grid-container">
        {products.map(p => (
          <div className="card" key={p._id}>
            <img src={p.image} alt={p.title} />
            <div className="card-content">
              <h4>{p.title}</h4>
              <p>₹{p.price}</p>
              <button className="view-btn" onClick={() => navigate(`/product/${p._id}`)}>View Product</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
