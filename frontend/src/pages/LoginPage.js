import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import { toast } from 'react-toastify';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async e => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    toast.success('Login successful!');

    // Delay navigation to show toast
    setTimeout(() => {
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'artisan') navigate('/artisan/dashboard');
      else navigate('/');
    }, 1000);
  } catch (err) {
    toast.error('Login failed. Please check your credentials.');
  }
}


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p>Please login to continue</p>
         <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            {/* password input with toggle */}
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="password-input"
            />

            <span
              className="toggle-icon"
              onClick={() => setShowPassword(prev => !prev)}
              role="button"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          
          <button type="submit">Login</button>
        </form>

        <p className="register-link">
          New user? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
