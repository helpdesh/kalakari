import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
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
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-2 text-center">🛠️ Admin Dashboard</h2>
      <p className="text-center text-gray-500 mb-6">Review and manage artisan products and accounts</p>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('products')}
        >
          📦 Product Requests
          <span className="ml-2 inline-block bg-white text-blue-600 rounded-full px-2 text-sm">
            {products.length}
          </span>
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === 'artisans' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('artisans')}
        >
          👥 Artisan Requests
          <span className="ml-2 inline-block bg-white text-blue-600 rounded-full px-2 text-sm">
            {unapprovedArtisans.length}
          </span>
        </button>
      </div>

      {/* Product Section */}
      {activeTab === 'products' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">📦 Pending Product Approvals</h3>
          {products.length === 0 ? (
            <p className="text-gray-500">No pending products 🚫</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
                  <div className="p-4 space-y-2">
                    <h4 className="text-lg font-semibold">{p.title}</h4>
                    <p className="text-sm text-gray-500">Category: {p.category}</p>
                    <p className="text-sm text-gray-500">Price: ₹{p.price}</p>
                    <p className="text-sm text-gray-500">Artisan: {p.artisanId?.name || 'Unknown'}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleApproveProduct(p._id)}
                      >
                        Approve ✅
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleRejectProduct(p._id)}
                      >
                        Reject ❌
                      </button>
                    </div>
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
              {unapprovedArtisans.map((user) => (
                <li key={user._id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handleApproveArtisan(user._id)}
                    >
                      Approve ✅
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleRejectArtisan(user._id)}
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
