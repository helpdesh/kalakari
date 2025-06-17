import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailOtpForm = ({ onVerified }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/otp/send-email-otp', { email });
      toast.success('OTP sent to your email');
      setShowOtpInput(true);
      setTimer(60); // 60 seconds cooldown
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/verify-email-otp', { email, otp });
      if (res.data.verified) {
        toast.success('Email verified ✅');
        onVerified(email); // pass email to parent (e.g. Register)
      } else {
        toast.error('Incorrect OTP');
      }
    } catch {
      toast.error('Verification failed');
    }
  };

  return (
    <div className="otp-form" style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <h2>Email Verification</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        disabled={showOtpInput}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
      />

      {showOtpInput && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
          />

          <button onClick={handleVerifyOtp} style={{ padding: '0.5rem 1rem' }}>
            Verify OTP
          </button>
        </>
      )}

      {!showOtpInput || timer === 0 ? (
        <button onClick={handleSendOtp} style={{ marginTop: '1rem' }}>
          {showOtpInput ? 'Resend OTP' : 'Send OTP'}
        </button>
      ) : (
        <p style={{ marginTop: '1rem' }}>⏳ Resend available in {timer}s</p>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default EmailOtpForm;
