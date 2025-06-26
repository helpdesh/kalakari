require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/ProductRoutes');
const adminRoutes = require('./routes/adminRoutes');
const emailOtpRoutes = require('./routes/emailOtpRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/otp', emailOtpRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', require('./routes/paymentRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));