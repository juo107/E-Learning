import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TypingText from '../components/home/TypingText';
import { register as registerApi, saveAuth } from '../services/auth';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    // Basic validation
    if (!fullName) {
      setError('Vui lòng nhập họ tên');
      setLoading(false);
      return;
    }

    if (!email) {
      setError('Vui lòng nhập email');
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const res = await registerApi({ fullName, email, password, confirmPassword, role: 'Student' });
      saveAuth(res);
      navigate('/');
    } catch (err: any) {
      // Extract error message from normalized error
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] w-full px-4 py-10 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-block text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">E-Learning</Link>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            <TypingText text="Join to start learning today." speedMs={18} startDelayMs={200} />
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg p-6">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Full name</label>
              <input name="fullName" type="text" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input name="email" type="email" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input name="password" type="password" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm password</label>
              <input name="confirmPassword" type="password" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70" placeholder="••••••••" />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Sign up'}
            </button>
          </form>
        </div>

        <div className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}


