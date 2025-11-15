import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Categories from './pages/Categories';
import Promotions from './pages/Promotions';
import Users from './pages/Users';
import Sections from './pages/Sections';
import Login from './pages/Login';
import Placeholder from './pages/Placeholder';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ToastContainer from './components/ui/Toast';

function App() {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
        {/* Public route - Login */}
        <Route 
          path="/login" 
          element={
            token ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/"
          element={
            token ? (
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Users Management */}
          <Route path="users" element={<Users />} />
          <Route path="users/instructors" element={<Placeholder />} />
          <Route path="users/students" element={<Placeholder />} />
          <Route path="users/admins" element={<Placeholder />} />
          
          {/* Course Management */}
          <Route path="courses" element={<Courses />} />
          <Route path="courses/moderation" element={<Placeholder />} />
          <Route path="courses/media" element={<Placeholder />} />
          <Route path="courses/editor" element={<Placeholder />} />
          <Route path="categories" element={<Categories />} />
          <Route path="sections" element={<Sections />} />
          
          {/* Revenue & Payments */}
          <Route path="revenue" element={<Placeholder />} />
          <Route path="revenue/payouts" element={<Placeholder />} />
          <Route path="revenue/tax" element={<Placeholder />} />
          
          {/* Moderation */}
          <Route path="moderation" element={<Placeholder />} />
          <Route path="moderation/reviews" element={<Placeholder />} />
          <Route path="moderation/reports" element={<Placeholder />} />
          <Route path="moderation/content" element={<Placeholder />} />
          
          {/* Promotions */}
          <Route path="promotions" element={<Promotions />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<Placeholder />} />
          <Route path="analytics/courses" element={<Placeholder />} />
          <Route path="analytics/platform" element={<Placeholder />} />
          
          {/* Platform Settings */}
          <Route path="settings" element={<Placeholder />} />
          <Route path="settings/system" element={<Placeholder />} />
          <Route path="settings/appearance" element={<Placeholder />} />
          <Route path="settings/notifications" element={<Placeholder />} />
          
          {/* Support */}
          <Route path="support" element={<Placeholder />} />
          <Route path="support/tickets" element={<Placeholder />} />
          <Route path="support/reports" element={<Placeholder />} />
          
          {/* Certificates */}
          <Route path="certificates" element={<Placeholder />} />
          <Route path="certificates/templates" element={<Placeholder />} />
          
          {/* API & Integrations */}
          <Route path="integrations" element={<Placeholder />} />
          <Route path="integrations/api-keys" element={<Placeholder />} />
          <Route path="integrations/webhooks" element={<Placeholder />} />
          <Route path="integrations/lms" element={<Placeholder />} />
          <Route path="integrations/streaming" element={<Placeholder />} />
          <Route path="integrations/payments" element={<Placeholder />} />
          
          {/* Udemy Business */}
          <Route path="udemy-business" element={<Placeholder />} />
          <Route path="udemy-business/teams" element={<Placeholder />} />
          <Route path="udemy-business/reports" element={<Placeholder />} />
        </Route>
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

