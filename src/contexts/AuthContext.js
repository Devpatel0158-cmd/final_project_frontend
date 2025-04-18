/*
    Author: Bhuwan Shrestha, Shubh Soni, Dev Patel, Alen varghese
    Description: This is the context for the authentication.
    Project Name: Expense Tracker
    date: 2025-March 28

*/
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        await loadUser();
        return true;
      }
      return false;
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(errorMsg);
      return false;
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      await loadUser();
      toast.success('Login successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/me', formData);
      setUser(res.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Profile update failed');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent. Please check your inbox.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Failed to send reset email');
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password reset successful. Please login with your new password.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Password reset failed');
      return false;
    }
  };

  const verifyEmail = async (token) => {
    try {
      await api.get(`/auth/verify-email?token=${token}`);
      toast.success('Email verified successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Email verification failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 