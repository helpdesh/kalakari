import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import '../index.css';
import { useNavigate } from "react-router-dom";

const UpdatePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const Navigate = useNavigate();

  // Get token and user email from localStorage
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let email = "";
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      email = user?.email || "";
    } catch {
      email = "";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/update-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === 'Password updated successfully') {
        setSuccess(true);
        toast.success('Password updated successfully!');
        Navigate('/'); // Redirect to login after successful update

      } else {
        toast.error(response.data.message || 'Password update failed');
      }
    } catch (err) {
      console.error("Password update failed", err);
      toast.error(err.response?.data?.message || 'Password update failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-2">Update Password</h2>
        {email && (
          <input
            type="email"
            value={email}
            readOnly
            className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700 cursor-not-allowed mb-2"
          />
        )}
        {success ? (
          <p className="text-green-600 text-center">Password updated successfully!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold transition"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePasswordPage;