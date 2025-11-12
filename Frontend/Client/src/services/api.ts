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
    const responseData = error?.response?.data;
    
    // Try to extract message from BaseResponse structure
    let message = 'Request failed';
    if (responseData) {
      // BaseResponse structure: { message: "...", success: false, data: ... }
      message = responseData.message 
        || responseData.title 
        || (typeof responseData === 'string' ? responseData : 'Request failed');
    } else {
      message = error?.message || 'Request failed';
    }
    
    const normalized = {
      status: error?.response?.status ?? 0,
      message: message,
      data: responseData,
      response: error?.response,
    };
    return Promise.reject(normalized);
  }
);

export default api;




