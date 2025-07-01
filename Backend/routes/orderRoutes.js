const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create Order
router.post('/', async (req, res) => {
  const { userId, items, total, address, paymentStatus } = req.body;
  console.log('🛒 Order incoming:', { userId, items, total, address, paymentStatus }); // ✅ Add this

  try {
    const order = new Order({
      userId,
      items,
      total,
      address,
      paymentStatus,
    });

    await order.save();
    console.log('✅ Order saved:', order); // ✅ Log saved order

    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    res.status(500).json({ error: 'Order failed' });
  }
});



router.get('/user/:id', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id }).populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err });
  }
});


// Cancel an order
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only allow cancelling if it's still pending
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});



module.exports = router;
