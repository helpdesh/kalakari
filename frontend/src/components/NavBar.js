import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavBar.css'; // Ensure you have this CSS file for styling

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/' && location.pathname !== '/home';
    
  return (
    <div className="navbar">
      {showBackButton && (
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      )}
      <button className="home-button" onClick={() => navigate('/')}>
        🏠 Home
      </button>
    </div>
  );
};

export default NavBar;
