import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: Verify token is still valid
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    if (Date.now() > exp) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  } catch {
    // Invalid token format
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

