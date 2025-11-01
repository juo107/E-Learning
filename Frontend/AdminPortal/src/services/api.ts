import axios from 'axios';

const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5180';

export const adminApi = axios.create({
  baseURL: `${ADMIN_API_URL}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;

