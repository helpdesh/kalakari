const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'receipt_order_' + Math.floor(Math.random() * 100000),
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
});

module.exports = router;
