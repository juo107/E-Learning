import { useState } from 'react';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5180';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/AdminAuth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.title || 'Login failed');
      }

      const token = data.data?.token || data.token;
      const userRole = data.data?.role || data.role;

      if (!token) {
        throw new Error('No token received');
      }

      if (userRole !== 'Admin' && userRole !== 'SystemSuperAdmin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        email: form.email,
        role: userRole,
        fullName: data.data?.fullName || data.fullName,
      }));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-10 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-block text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent mb-1">
            E-Learning Admin Portal
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Secure access to your admin dashboard
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg p-6">
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@elearn.com"
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2.5 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
            {error && (
              <p id="login-error" className="sr-only" aria-live="assertive">
                {error}
              </p>
            )}
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3 font-medium uppercase tracking-wider">
              Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <p className="text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <code className="text-indigo-600 dark:text-indigo-400 font-mono break-all">
                  admin@elearn.com
                </code>
              </div>
              <div className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <p className="text-gray-500 dark:text-gray-400 mb-1">Password</p>
                <code className="text-indigo-600 dark:text-indigo-400 font-mono">
                  Admin@123456
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
