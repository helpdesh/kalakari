import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css'; // Ensure you have this CSS file for styling
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [unapprovedArtisans, setUnapprovedArtisans] = useState([]);

  useEffect(() => {
    fetchUnapprovedProducts();
    fetchUnapprovedArtisans();
  }, []);

  const fetchUnapprovedProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/unapproved');
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchUnapprovedArtisans = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/unapproved-artisans');
      setUnapprovedArtisans(res.data);
    } catch (err) {
      toast.error('Failed to fetch artisans');
    }
  };

  const handleApproveProduct = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/approve/${id}`, { isApproved: true });
      toast.success('Product approved ✅');
      fetchUnapprovedProducts();
    } catch (err) {
      toast.error('Error approving product');
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
      }
    }
  };

  const handleApproveArtisan = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/approve-artisan/${id}`);
      toast.success('Artisan approved ✅');
      fetchUnapprovedArtisans();
    } catch (err) {
      toast.error('Error approving artisan');
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
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <h2 className="text-3xl font-bold text-orange-600 mb-2">🛠️ Admin Dashboard</h2>
      <p className="mb-6 text-gray-600">Review and manage artisan products and accounts</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'products'
              ? 'bg-orange-600 text-white'
              : 'bg-white border border-orange-300 text-orange-600'
          }`}
          onClick={() => setActiveTab('products')}
        >
          📦 Product Requests <span className="ml-1 bg-white text-orange-600 font-bold px-2 py-0.5 rounded-full">{products.length}</span>
        </button>
        <button
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'artisans'
              ? 'bg-orange-600 text-white'
              : 'bg-white border border-orange-300 text-orange-600'
          }`}
          onClick={() => setActiveTab('artisans')}
        >
          👥 Artisan Requests <span className="ml-1 bg-white text-orange-600 font-bold px-2 py-0.5 rounded-full">{unapprovedArtisans.length}</span>
        </button>
      </div>

      {/* Product Section */}
      {activeTab === 'products' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">📦 Pending Product Approvals</h3>
          {products.length === 0 ? (
            <p className="text-gray-500">No pending products 🚫</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p._id} className="bg-white shadow rounded p-4">
                  <img src={p.image} alt={p.title} className="w-full h-48 object-cover rounded mb-3" />
                  <h4 className="font-semibold">{p.title}</h4>
                  <p className="text-sm text-gray-600">Category: {p.category}</p>
                  <p className="text-sm text-gray-600">Price: ₹{p.price}</p>
                  <p className="text-sm text-gray-600 mb-2">Artisan: {p.artisanId?.name || 'Unknown'}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveProduct(p._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve ✅
                    </button>
                    <button
                      onClick={() => handleRejectProduct(p._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Artisan Section */}
      {activeTab === 'artisans' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">👥 Pending Artisan Approvals</h3>
          {unapprovedArtisans.length === 0 ? (
            <p className="text-gray-500">No pending artisans 🚫</p>
          ) : (
            <ul className="space-y-4">
              {unapprovedArtisans.map(user => (
                <li
                  key={user._id}
                  className="bg-white shadow rounded flex justify-between items-center p-4"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveArtisan(user._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve ✅
                    </button>
                    <button
                      onClick={() => handleRejectArtisan(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject ❌
                    </button>
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
