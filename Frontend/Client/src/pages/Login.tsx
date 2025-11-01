import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TypingText from '../components/home/TypingText';
import { login as loginApi, saveAuth } from '../services/auth';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-[80vh] w-full px-4 py-10 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-block text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">E-Learning</Link>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            <TypingText text={t('auth.welcomeBack')} speedMs={18} startDelayMs={200} />
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg p-6">
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm flex items-center justify-center gap-2">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 48 48" className="shrink-0"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.043,6.053,28.761,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.681,16.108,19.01,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.043,6.053,28.761,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.197l-6.191-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.274-7.952l-6.51,5.02C9.525,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.086,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.191,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
              <span>Google</span>
            </button>
            <button className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm flex items-center justify-center gap-2">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" className="shrink-0"><path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.927-1.953 1.88v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              <span>Facebook</span>
            </button>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800" /></div>
            <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-950 px-2 text-xs text-gray-500">or continue with email</span></div>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e)=>{
              e.preventDefault();
              setError(null);
              const form = e.currentTarget as HTMLFormElement;
              const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
              const password = (form.elements.namedItem('password') as HTMLInputElement).value;
              if (!email || !password) {
                setError(t('auth.emailRequired') + ' ' + t('auth.passwordRequired'));
                return;
              }
              try {
                setIsSubmitting(true);
                const res = await loginApi({ email, password });
                saveAuth(res);
                
                // Update auth context
                login(
                  { email: res.email, fullName: res.fullName, role: res.role },
                  res.token
                );
                
                const role = (res.role || '').toLowerCase();
                
                // Redirect based on user role
                if (role === 'admin') {
                  navigate('/admin');
                } else if (role === 'teacher' || role === 'instructor') {
                  navigate('/instructor');
                } else {
                  navigate('/dashboard');
                }
              } catch (err: any) {
                if (err?.status === 401) {
                  setError(t('auth.invalidCredentials'));
                } else if (err?.status === 400) {
                  const serverMsg = err?.data?.title || err?.message || t('auth.loginError');
                  setError(serverMsg);
                } else {
                  setError(t('auth.loginError'));
                }
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div>
              <label className="block text-sm mb-1">{t('auth.email')}</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                placeholder="you@example.com"
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm mb-1">{t('auth.password')}</label>
                <button type="button" className="text-xs text-indigo-600 hover:underline">{t('auth.forgotPassword')}</button>
              </div>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                placeholder="••••••••"
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 rounded-lg font-medium text-white transition-colors ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('auth.login')}
            </button>
            {error && (
              <p id="login-error" className="sr-only" aria-live="assertive">{error}</p>
            )}
          </form>
        </div>

        <div className="mt-4 text-sm text-center">
          {t('auth.dontHaveAccount')} <Link to="/register" className="text-indigo-600 hover:underline">{t('auth.register')}</Link>
        </div>
      </div>
    </div>
  );
}


