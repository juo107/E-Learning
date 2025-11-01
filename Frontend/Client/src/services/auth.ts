import api from './api';

export type AuthResponse = {
  token: string;
  email: string;
  fullName: string;
  role: string;
  expiresAt: string;
};

export async function register(payload: { email: string; password: string; confirmPassword: string; fullName: string; role?: string }) {
  const res = await api.post('/api/Auth/register', { role: 'User', ...payload });
  return res.data?.data ?? (res.data as AuthResponse);
}

export async function login(payload: { email: string; password: string }) {
  const res = await api.post('/api/Auth/login', payload);
  return res.data?.data ?? (res.data as AuthResponse);
}

export function saveAuth(auth: AuthResponse) {
  localStorage.setItem('auth_token', auth.token);
  localStorage.setItem('auth_user', JSON.stringify({ email: auth.email, fullName: auth.fullName, role: auth.role }));
}

export function getToken() {
  return localStorage.getItem('auth_token');
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}


