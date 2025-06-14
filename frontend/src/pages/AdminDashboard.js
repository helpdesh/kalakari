import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { toast } from 'react-toastify';


const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  const fetchUnapprovedProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/unapproved');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching unapproved products:', err);
    }
  };

  const handleApprove = async (id) => {
  try {
    await axios.patch(`http://localhost:5000/api/products/approve/${id}`, {
      isApproved: true
    });
    toast.success('Product approved!');
    fetchUnapprovedProducts();
  } catch (err) {
    toast.error('Failed to approve product');
    console.error('Error approving product:', err);
  }
};


  useEffect(() => {
    fetchUnapprovedProducts();
  }, []);

  return (
    <div className="admin-dashboard">
  <h2>🛠️ Admin Dashboard</h2>
  <p>Review and approve artisan products</p>

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
            <button onClick={() => handleApprove(p._id)}>Approve ✅</button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default AdminDashboard;