const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth'); // For authenticated routes

// ✅ Create a new product (only if artisan is approved)
router.post('/', async (req, res) => {
  const { title, description, price, image, category, artisanId } = req.body;

  try {
    const artisan = await User.findById(artisanId);
    if (!artisan) return res.status(404).json({ message: 'Artisan not found' });

    if (artisan.role === 'artisan' && !artisan.isApproved) {
      return res.status(403).json({ message: 'Your artisan profile is not approved yet.' });
    }

    const product = new Product({ title, description, price, image, category, artisanId });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('[Product POST Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a review to a product
// Place this BEFORE `/:id` route
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } catch (error) {
    console.error('[Review POST Error]', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all approved products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get products by artisan ID
router.get('/artisan/:artisanId', async (req, res) => {
  try {
    const products = await Product.find({ artisanId: req.params.artisanId });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get unapproved products (admin use)
router.get('/unapproved', async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false }).populate('artisanId', 'name email');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Approve or reject a product (admin use)
router.patch('/approve/:id', async (req, res) => {
  const { isApproved } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
