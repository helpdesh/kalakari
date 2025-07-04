import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
const CartPage = () => {
  const { cartItems, setCartItems, removeFromCart } = useCart();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    mobile: '',
    pincode: '',
    state: '',
    city: '',
    address: '',
    paymentMode: '',
  });

  const rawUser = JSON.parse(localStorage.getItem('user')) || {};
  const user = { ...rawUser, _id: rawUser._id || rawUser.id };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQuantity = (id) => {
    const updated = cartItems.map(item =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    toast.info('Quantity increased');
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const decreaseQuantity = (id) => {
    const updated = cartItems.map(item =>
      item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    toast.info('Quantity decreased');
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const saveOrder = async (paymentStatus) => {
    try {
      await axios.post('http://localhost:5000/api/orders', {
        userId: user._id,
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          artisan: item.artisan,
        })),
        total: totalPrice,
        address: deliveryDetails.address,
        paymentStatus,
      });

      toast.success(`Order placed successfully (${paymentStatus})`);
      setCartItems([]);
      localStorage.removeItem('cart');
      setShowDeliveryForm(false);
    } catch (err) {
      toast.error('Failed to save order');
      console.error(err);
    }
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.success('Item removed from cart');
  };

  const handlePlaceOrder = () => {
    setShowDeliveryForm(true);
    toast.info('Enter your delivery details');
  };

  const handlePayment = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/payment/order', {
        amount: totalPrice * 100,
      });

      const { order } = res.data;

      const options = {
        key: 'rzp_test_LOiqgNY2f5M6Kw',
        amount: order.amount,
        currency: 'INR',
        name: 'Desi-Etsy',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response) {
          await saveOrder('Paid');
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#cc5200' },
        modal: {
          ondismiss: function () {
            toast.warning('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error("❌ Payment Failed: " + response.error.description);
      });

      rzp.open();
    } catch (error) {
      toast.error('Payment initiation failed');
      console.error('Payment Error:', error);
    }
  };

  const handleFinalSubmit = () => {
    const { name, mobile, address, paymentMode, pincode, state, city } = deliveryDetails;

    if (!name || !mobile || !address || !pincode || !state || !city) {
      toast.error('Please fill in all delivery details');
      return;
    }

    if (!user || !user._id) {
      toast.error('You must be logged in to place an order');
      return;
    }

    if (paymentMode === 'cod') {
      saveOrder('Pending');
    } else {
      handlePayment();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Cart or Delivery Form */}
          <div className="flex-1">
            {!showDeliveryForm ? (
              <ul className="space-y-6">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex gap-4 border p-4 rounded shadow-sm">
                    <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="bg-gray-200 px-2 py-1 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="bg-gray-200 px-2 py-1 rounded"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="mt-2 text-red-600 hover:underline"
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">🏠 Delivery Address</h3>
                {[
                  { name: 'name', placeholder: 'Full Name' },
                  { name: 'mobile', placeholder: 'Mobile Number', type: 'tel' },
                  { name: 'pincode', placeholder: 'Pincode' },
                  { name: 'state', placeholder: 'State' },
                  { name: 'city', placeholder: 'City' },
                ].map(({ name, placeholder, type = 'text' }) => (
                  <input
                    key={name}
                    type={type}
                    placeholder={placeholder}
                    value={deliveryDetails[name]}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, [name]: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                ))}
                <textarea
                  placeholder="Flat / Area / Landmark"
                  rows="3"
                  value={deliveryDetails.address}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                  className="w-full border p-2 rounded"
                ></textarea>

                <select
                  value={deliveryDetails.paymentMode}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, paymentMode: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Payment Mode</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">Razorpay</option>
                </select>

                <button
                  onClick={handleFinalSubmit}
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                >
                  Confirm Order
                </button>
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div className="w-full lg:w-1/3 bg-gray-50 p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">🧾 Order Summary</h3>
            <p>Total Items: {totalItems}</p>
            <p>Total Price: ₹{totalPrice}</p>

            {!showDeliveryForm && (
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default CartPage;
