const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: String,
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  isApproved: { type: Boolean, default: false },

  reviews: [
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
],
rating: { type: Number, default: 0 },
numReviews: { type: Number, default: 0 },

});


module.exports = mongoose.model('Product', productSchema);