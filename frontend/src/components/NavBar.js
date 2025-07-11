import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const user = JSON.parse(localStorage.getItem('user'));
  const isPrivilegedUser = user?.role === 'artisan' || user?.role === 'admin';

  const showBackButton = currentPath !== '/' && currentPath !== '/home';

  const handleBack = () => {
    if (currentPath === '/login' && isPrivilegedUser) {
      localStorage.removeItem('user');
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    if (isPrivilegedUser) {
      localStorage.removeItem('user');
    }
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Back Button */}
      {showBackButton ? (
        <button
          onClick={handleBack}
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}

      {/* Home Button */}
      <button
        onClick={handleHome}
        className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
      >
        🏠 Home
      </button>
    </nav>
  );
};

export default NavBar;
