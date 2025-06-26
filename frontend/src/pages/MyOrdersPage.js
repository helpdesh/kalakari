import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyOrdersPage.css';
import { toast } from 'react-toastify';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
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
    if (user?.id) fetchOrders();
  }, [user.id]);

  return (
    <div className="orders-page">
      <h2>My Orders 🧾</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span><strong>Date:</strong> {new Date(order.placedAt).toLocaleDateString()}</span>
            </div>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
            <p><strong>Status:</strong> {order.status}</p>

            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.productId?.title || 'Unnamed Product'} × {item.quantity}
                </li>
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
    </div>
  );
};

export default MyOrdersPage;
