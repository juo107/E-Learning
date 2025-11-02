import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Categories from './pages/Categories';
import Promotions from './pages/Promotions';
import Login from './pages/Login';
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
          <Route path="courses" element={<Courses />} />
          <Route path="categories" element={<Categories />} />
          <Route path="promotions" element={<Promotions />} />
        </Route>
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

