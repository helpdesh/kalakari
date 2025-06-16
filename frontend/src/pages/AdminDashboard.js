import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [unapprovedArtisans, setUnapprovedArtisans] = useState([]);

  useEffect(() => {
    fetchUnapprovedProducts();
    fetchUnapprovedArtisans();
  }, []);

  // Fetch unapproved products
  const fetchUnapprovedProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/unapproved');
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
      console.error(err);
    }
  };

  // Fetch unapproved artisans
  const fetchUnapprovedArtisans = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/unapproved-artisans');
      setUnapprovedArtisans(res.data);
    } catch (err) {
      toast.error('Failed to fetch artisans');
      console.error(err);
    }
  };

  // Product actions
  const handleApproveProduct = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/approve/${id}`, { isApproved: true });
      toast.success('Product approved ✅');
      fetchUnapprovedProducts();
    } catch (err) {
      toast.error('Error approving product');
      console.error(err);
    }
  };

  const handleRejectProduct = async (id) => {
    if (window.confirm('Are you sure you want to reject this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.error('Product rejected ❌');
        fetchUnapprovedProducts();
      } catch (err) {
        toast.error('Error rejecting product');
        console.error(err);
      }
    }
  };

  // Artisan actions
  const handleApproveArtisan = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/approve-artisan/${id}`);
      toast.success('Artisan approved ✅');
      fetchUnapprovedArtisans();
    } catch (err) {
      toast.error('Error approving artisan');
      console.error(err);
    }
  };

  const handleRejectArtisan = async (id) => {
    if (window.confirm('Are you sure you want to reject this artisan?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/reject-artisan/${id}`);
        toast.error('Artisan rejected ❌');
        fetchUnapprovedArtisans();
      } catch (err) {
        toast.error('Error rejecting artisan');
        console.error(err);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>🛠️ Admin Dashboard</h2>
      <p>Review and manage artisan products and accounts</p>

      {/* Tabs */}
      <div className="admin-tabs">
      <button
        className={activeTab === 'products' ? 'active' : ''}
        onClick={() => setActiveTab('products')}
      >
        📦 Product Requests <span className="badge">{products.length}</span>
      </button>

      <button
        className={activeTab === 'artisans' ? 'active' : ''}
        onClick={() => setActiveTab('artisans')}
      >
        👥 Artisan Requests <span className="badge">{unapprovedArtisans.length}</span>
      </button>
    </div>



      {/* Product Section */}
      {activeTab === 'products' && (
        <div>
          <h3>📦 Pending Product Approvals</h3>
          {products.length === 0 ? (
            <p className="no-products">No pending products 🚫</p>
          ) : (
            <div className="admin-grid">
              {products.map(p => (
                <div className="admin-card" key={p._id}>
                  <img src={p.image} alt={p.title} />
                  <div className="card-info">
                    <h4>{p.title}</h4>
                    <p>Category: {p.category}</p>
                    <p>Price: ₹{p.price}</p>
                    <p>Artisan: {p.artisanId?.name || 'Unknown'}</p>

                    <button onClick={() => handleApproveProduct(p._id)}>Approve ✅</button>
                    <button onClick={() => handleRejectProduct(p._id)} className="reject-btn">Reject ❌</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Artisan Section */}
      {activeTab === 'artisans' && (
        <div className="artisan-approval">
          <h3>👥 Pending Artisan Approvals</h3>
          {unapprovedArtisans.length === 0 ? (
            <p className="no-artisans">No pending artisans 🚫</p>
          ) : (
            <ul className="artisan-list">
              {unapprovedArtisans.map(user => (
                <li key={user._id} className="artisan-card">
                  <div>
                    <strong>{user.name}</strong> — {user.email}
                  </div>
                  <div className="artisan-actions">
                    <button onClick={() => handleApproveArtisan(user._id)}>Approve ✅</button>
                    <button onClick={() => handleRejectArtisan(user._id)} className="reject-btn">Reject ❌</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AdminDashboard;
