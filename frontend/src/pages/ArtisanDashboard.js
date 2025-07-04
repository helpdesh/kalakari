import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css'; // Ensure you have this CSS file for styling

const ArtisanDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    _id: ''
  });


  const user = JSON.parse(localStorage.getItem('user'));
  const artisanId = user?._id;

  useEffect(() => {
    if (user?.role === 'artisan') {
      fetchProducts();
      fetchOrders();
    }
  }, []);


  const fetchProducts = async () => {
    const res = await axios.get(`http://localhost:5000/api/products/artisan/${artisanId}`);
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get(`http://localhost:5000/api/orders/artisan/${artisanId}`);
    setOrders(res.data);
  };

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

    try {
      if (form._id) {
        await axios.put(`http://localhost:5000/api/products/${form._id}`, productData);
        toast.success('Product updated successfully ✅');
      } else {
        await axios.post('http://localhost:5000/api/products', productData);
        toast.success('Product added successfully ✅');
      }
      setForm({ title: '', description: '', price: '', image: '', category: '', _id: '' });
      fetchProducts();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response.data.message || 'You are not approved to add products');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      toast.success('Product deleted successfully ❌');
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting product');
    }
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
    toast.info('Editing product...');
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getNextStatus = (current) => {
    const flow = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const idx = flow.indexOf(current);
    return idx !== -1 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6">👨‍🎨 Artisan Dashboard</h2>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4">
        <h3 className="text-xl font-semibold mb-4">{form._id ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Product Title" value={form.title} onChange={handleChange} required className="input input-bordered w-full" />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="input input-bordered w-full" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="input input-bordered w-full" />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="textarea textarea-bordered w-full mt-2" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          {form._id ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {/* Product List */}
      <h3 className="text-xl font-semibold mb-4">📦 My Products</h3>
      <ul className="space-y-3 mb-10">
        {products.map(p => (
          <li key={p._id} className="bg-white shadow-md p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-gray-500">₹{p.price} {p.isApproved ? '✅' : '❌'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Orders */}
      <h3 className="text-xl font-semibold mb-4">📬 Orders to Manage</h3>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="bg-white shadow-md rounded p-4 space-y-2">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Customer:</strong> {order.user?.name || 'Unknown'}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <ul className="pl-4 list-disc">
                {order.items.filter(item => item.artisan === artisanId).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <img src={item.productId?.image} alt="" className="w-12 h-12 object-cover rounded" />
                    {item.productId?.title} × {item.quantity}
                  </li>
                ))}
              </ul>
              {getNextStatus(order.status) && (
                <button
                  onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded mt-2"
                >
                  Mark as {getNextStatus(order.status)}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ArtisanDashboard;
