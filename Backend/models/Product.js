const mongoose = require('mongoose');
// ✅ Define product schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String },

    // Artisan Info
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: { type: Boolean, default: false },

    // Reviews
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Export model
module.exports = mongoose.model('Product', productSchema);
