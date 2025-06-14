import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ArtisanDashboard.css'; // Add your CSS styles here

const ArtisanDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    _id: '' // used for editing
  });

  const artisanId = '684bd1139b419c567ba4f4fa'; // Replace with dynamic login later

  const fetchProducts = async () => {
    const res = await axios.get(`http://localhost:5000/api/products/artisan/${artisanId}`);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const productData = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      category: form.category,
      artisanId
    };

    if (form._id) {
      // Update product
      await axios.put(`http://localhost:5000/api/products/${form._id}`, productData);
    } else {
      // Create new product
      await axios.post('http://localhost:5000/api/products', productData);
    }

    setForm({ title: '', description: '', price: '', image: '', category: '', _id: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      _id: product._id
    });
  };

  return (
    <div className="artisan-dashboard">
  <h2>👨‍🎨 Artisan Dashboard</h2>

  {/* Product form */}
  <form onSubmit={handleSubmit} className="product-form">
    <input name="title" placeholder="Product Title" value={form.title} onChange={handleChange} required />
    <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
    <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
    <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
    <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
    <button type="submit">{form._id ? 'Update' : 'Add'} Product</button>
  </form>

  {/* Product list */}
  <h3>📦 My Products</h3>
  <ul className="product-list">
    {products.map(p => (
      <li key={p._id} className="product-item">
        <div>
          <strong>{p.title}</strong> — ₹{p.price} {p.isApproved ? '✅' : '❌'}
        </div>
        <div>
          <button onClick={() => handleEdit(p)}>Edit</button>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      </li>
    ))}
  </ul>
</div>
  );
};

export default ArtisanDashboard;
