import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/' && location.pathname !== '/home';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Back Button */}
      {showBackButton ? (
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}

      {/* Home Button */}
      <button
        onClick={() => navigate('/')}
        className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
      >
        🏠 Home
      </button>
    </nav>
  );
};

export default NavBar;
