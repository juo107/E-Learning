import axios from 'axios';
import { getToken } from './auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const finalBaseUrl = apiBaseUrl ?? 'https://localhost:7135';

console.log('API Base URL:', finalBaseUrl);

export const api = axios.create({
  baseURL: finalBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error shape
    const normalized = {
      status: error?.response?.status ?? 0,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        'Request failed',
      data: error?.response?.data,
    };
    return Promise.reject(normalized);
  }
);

export default api;




