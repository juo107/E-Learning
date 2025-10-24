import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/login' 
}) => {
  const { isAuthenticated, isLoading, hasAnyRole, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    // Redirect to appropriate dashboard based on user role
    const userRole = user?.role.toLowerCase();
    let redirectPath = '/dashboard'; // default for students
    
    if (userRole === 'admin') {
      redirectPath = '/admin';
    } else if (userRole === 'teacher' || userRole === 'instructor') {
      redirectPath = '/instructor';
    }

    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
