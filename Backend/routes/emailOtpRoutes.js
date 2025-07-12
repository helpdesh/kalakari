const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

const otpStore = new Map(); // Temporary OTP store

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 📤 Send OTP
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Email template
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: '🛡️ OTP Verification - Desi-Etsy',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #cc5200;">Desi-Etsy OTP Verification</h2>
          <p>Dear User,</p>
          <p>Thank you for registering with <strong>Desi-Etsy</strong>.</p>
          <p><strong style="font-size: 18px;">🔐 Your OTP: <span style="color: #cc5200;">${otp}</span></strong></p>
          <p>This OTP is valid for <strong>5 minutes</strong>.</p>
          <p>If you did not request this, ignore this message.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #888;">Best regards,<br>Desi-Etsy Team</p>
        </div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    // Store OTP temporarily
    otpStore.set(email, otp);
    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000); // expire after 5 minutes

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP. Try again later.' });
  }
});

// ✅ Verify OTP
router.post('/verify-email-otp', (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ verified: false, message: 'OTP expired or not sent' });
  }

  if (stored === otp) {
    otpStore.delete(email);
    return res.status(200).json({ verified: true });
  } else {
    return res.status(400).json({ verified: false, message: 'Invalid OTP' });
  }
});

module.exports = router;
