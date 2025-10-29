import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Courses from '../pages/Courses';
import CourseDetail from '../pages/CourseDetail';
import StudentDashboard from '../pages/StudentDashboard';
import TestDashboard from '../pages/TestDashboard';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Layout from './Layout';
import Maintenance from '../pages/Maintenance';
import AdminLayout from './layout/AdminLayout';
import InstructorLayout from './layout/InstructorLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import CoursesAdmin from '../pages/admin/CoursesAdmin';
import CategoriesAdmin from '../pages/admin/CategoriesAdmin';
import UsersAdmin from '../pages/admin/UsersAdmin';
import OrdersAdmin from '../pages/admin/OrdersAdmin';
import RevenueAdmin from '../pages/admin/RevenueAdmin';
import ProductsAdmin from '../pages/admin/ProductsAdmin';
import SystemAdmin from '../pages/admin/SystemAdmin';
import SettingsAdmin from '../pages/admin/SettingsAdmin';
import InstructorDashboard from '../pages/instructor/Dashboard';
import InstructorCourses from '../pages/instructor/Courses';
import InstructorAnalytics from '../pages/instructor/Analytics';
import InstructorEarnings from '../pages/instructor/Earnings';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Sitemap from '../pages/Sitemap';
import About from '../pages/About';
import Careers from '../pages/Careers';
import Blog from '../pages/Blog';
import Press from '../pages/Press';
import Partners from '../pages/Partners';
import Investors from '../pages/Investors';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorPage from '../pages/ErrorPage';
import Terms from '../pages/legal/Terms';
import Privacy from '../pages/legal/Privacy';
import Cookies from '../pages/legal/Cookies';

export const router = createBrowserRouter([
  // Maintenance standalone (không Header/Footer)
  { path: '/maintenance', element: <Maintenance /> },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/courses', element: <Courses /> },
      { path: '/course/:id', element: <CourseDetail /> },
      { 
        path: '/dashboard', 
        element: (
          <ProtectedRoute requiredRoles={['student', 'user']}>
            <StudentDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/test-dashboard', 
        element: (
          <ProtectedRoute requiredRoles={['student', 'user']}>
            <TestDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/settings', 
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/profile', 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ) 
      },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/sitemap', element: <Sitemap /> },
      { path: '/about', element: <About /> },
      { path: '/careers', element: <Careers /> },
      { path: '/blog', element: <Blog /> },
      { path: '/press', element: <Press /> },
      { path: '/partners', element: <Partners /> },
      { path: '/investors', element: <Investors /> },
      // Legal
      { path: '/legal/terms', element: <Terms /> },
      { path: '/legal/privacy', element: <Privacy /> },
      { path: '/legal/cookies', element: <Cookies /> },
      // 404 - custom error page
      { path: '*', element: <ErrorPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute requiredRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/courses', element: <CoursesAdmin /> },
      { path: '/admin/categories', element: <CategoriesAdmin /> },
      { path: '/admin/users', element: <UsersAdmin /> },
      { path: '/admin/orders', element: <OrdersAdmin /> },
      { path: '/admin/revenue', element: <RevenueAdmin /> },
      { path: '/admin/products', element: <ProductsAdmin /> },
      { path: '/admin/system', element: <SystemAdmin /> },
      { path: '/admin/settings', element: <SettingsAdmin /> },
    ],
  },
  {
    element: (
      <ProtectedRoute requiredRoles={['teacher', 'instructor']}>
        <InstructorLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/instructor', element: <InstructorDashboard /> },
      { path: '/instructor/courses', element: <InstructorCourses /> },
      { path: '/instructor/analytics', element: <InstructorAnalytics /> },
      { path: '/instructor/earnings', element: <InstructorEarnings /> },
    ],
  },
]);

export default router;


