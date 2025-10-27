// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Sesuaikan dengan URL backend Anda

// Set token ke header axios
const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Cek token di localStorage dan set ke header
if (localStorage.getItem('token')) {
  setAuthHeader(localStorage.getItem('token'));
}

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = response.data;
    
    // Simpan token ke localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set token ke header axios
    setAuthHeader(token);
    
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    const { token, user } = response.data;
    
    // Simpan token ke localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set token ke header axios
    setAuthHeader(token);
    
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const logout = () => {
  // Hapus token dari localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Hapus token dari header axios
  setAuthHeader(null);
  
  return { success: true };
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const createAdminUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/create-admin`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};