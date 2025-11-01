import { Link } from 'react-router-dom';
import TypingText from '../components/home/TypingText';
import { register as registerApi, saveAuth } from '../services/auth';

export default function Register() {
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
          <form className="space-y-4" onSubmit={async (e)=>{ e.preventDefault(); const form = e.currentTarget as HTMLFormElement; const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value; const email = (form.elements.namedItem('email') as HTMLInputElement).value; const password = (form.elements.namedItem('password') as HTMLInputElement).value; const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value; const res = await registerApi({ fullName, email, password, confirmPassword, role: 'User' }); saveAuth(res); window.location.href = '/'; }}>
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
            <button type="submit" className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium">Sign up</button>
          </form>
        </div>

        <div className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}


