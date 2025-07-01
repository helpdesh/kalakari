import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyOrdersPage.css';
import { toast } from 'react-toastify';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (err) {
      console.error("Cancel failed:", err);
      toast.error('Failed to cancel order');
    }
  };

  useEffect(() => {
    if (user?._id) fetchOrders();
  }, [user._id]);

  const filteredOrders = orders.filter(order =>
    statusFilter === 'All' ? true : order.status === statusFilter
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.placedAt) - new Date(a.placedAt);
    if (sortBy === 'total') return b.total - a.total;
    return 0;
  });

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  return (
    <div className="orders-page">
      <h2>My Orders 🧾</h2>

      <div className="orders-header">
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Cancelled">Cancelled</option>
      </select>

     <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
      <option value="latest">Latest First</option>
      <option value="total">Sort by Total</option>
    </select>
      </div>
      
      {paginatedOrders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        paginatedOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span><strong>Date:</strong> {new Date(order.placedAt).toLocaleDateString()}</span>
            </div>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
            <p><strong>Status:</strong> 
              <span className={`status-badge status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </p>


            <ul>
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <img src={item.productId?.image} alt="Product" />
                  <span>{item.productId?.title || 'Unnamed Product'} × {item.quantity}</span>
                </div>
              ))}
            </ul>

            {order.status === 'Pending' && (
              <button className="cancel-btn" onClick={() => handleCancel(order._id)}>
                Cancel Order
              </button>
            )}
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
