import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtisanDashboard from './pages/ArtisanDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import CategoryPage from './pages/CategoryPage';
import MyOrdersPage from './pages/MyOrdersPage';
import NavBar from './components/NavBar';
import { ToastContainer } from 'react-toastify'; // ✅ IMPORT
import 'react-toastify/dist/ReactToastify.css'; // ✅ STYLE

function App() {
  return (
    <Router>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ ADD TOAST CONTAINER */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />

        {/* Protected route: Customer/Artisan/Admin can access cart */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['customer', 'artisan', 'admin']}>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* Protected route: Admin only */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected route: Artisan only */}
        <Route
          path="/artisan/dashboard"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <ArtisanDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
