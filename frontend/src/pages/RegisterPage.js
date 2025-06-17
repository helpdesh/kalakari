import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🧠 Single unmet requirement message
  const getPasswordError = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
    if (!/\d/.test(password)) return 'Password must include at least one number.';
    if (!/[\W_]/.test(password)) return 'Password must include at least one special character.';
    return '';
  };

  const handleSendOtp = async () => {
    const passwordError = getPasswordError(form.password);
    if (passwordError) {
      toast.error(passwordError); // Or remove this line if no toast needed
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/otp/send-email-otp', { email: form.email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/verify-email-otp', {
        email: form.email,
        otp
      });

      if (res.data.verified) {
        await axios.post('http://localhost:5000/api/auth/register', form);
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        toast.error('Invalid OTP');
      }
    } catch {
      toast.error('Verification failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create an Account ✨</h2>
        <p>Register to explore Desi-Etsy</p>

        {step === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="password-input"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            {/* 🔽 Show only one missing rule */}
            {form.password && getPasswordError(form.password) && (
              <p className="password-error">{getPasswordError(form.password)}</p>
            )}

            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="artisan">Artisan</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Register</button>
          </form>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter OTP sent to email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
            />
            <button onClick={handleVerifyOtp}>Verify & Create Account</button>
          </div>
        )}

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
