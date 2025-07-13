const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: String,
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  isApproved: { type: Boolean, default: false },
  reviews: [reviewSchema],
  numReviews: Number,
});
module.exports = mongoose.model('Product', productSchema);