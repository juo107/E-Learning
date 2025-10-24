import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  BarChart3, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Plus,
  Bell,
  Search,
  User,
  ChevronDown,
  GraduationCap,
  Target,
  Eye,
  MessageCircle,
  Award
} from 'lucide-react';

const InstructorLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/instructor', icon: Home, current: location.pathname === '/instructor' },
    { name: 'Khóa học', href: '/instructor/courses', icon: BookOpen, current: location.pathname === '/instructor/courses' },
    { name: 'Phân tích', href: '/instructor/analytics', icon: BarChart3, current: location.pathname === '/instructor/analytics' },
    { name: 'Thu nhập', href: '/instructor/earnings', icon: DollarSign, current: location.pathname === '/instructor/earnings' },
    { name: 'Học viên', href: '/instructor/students', icon: Users, current: location.pathname === '/instructor/students' },
    { name: 'Tin nhắn', href: '/instructor/messages', icon: MessageCircle, current: location.pathname === '/instructor/messages' },
    { name: 'Cài đặt', href: '/instructor/settings', icon: Settings, current: location.pathname === '/instructor/settings' }
  ];

  const quickActions = [
    { name: 'Tạo khóa học mới', href: '/instructor/courses/create', icon: Plus },
    { name: 'Xem thống kê', href: '/instructor/analytics', icon: BarChart3 },
    { name: 'Quản lý thu nhập', href: '/instructor/earnings', icon: DollarSign }
  ];

  const stats = [
    { name: 'Tổng khóa học', value: '12', icon: BookOpen, color: 'text-blue-600' },
    { name: 'Học viên', value: '2,847', icon: Users, color: 'text-green-600' },
    { name: 'Thu nhập', value: '$45,680', icon: DollarSign, color: 'text-purple-600' },
    { name: 'Đánh giá', value: '4.8', icon: Award, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Instructor</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`${
                      item.current
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left`}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Instructor</span>
            </div>
            
            {/* Quick Stats */}
            <div className="px-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                        <div className="ml-2">
                          <p className="text-xs text-gray-600 dark:text-gray-400">{stat.name}</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`${
                      item.current
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="px-4 mt-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Thao tác nhanh
              </h3>
              <div className="space-y-1">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.name}
                      onClick={() => navigate(action.href)}
                      className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md w-full text-left"
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {action.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-300">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-0 focus:border-transparent sm:text-sm bg-gray-50 dark:bg-gray-700 rounded-lg"
                    placeholder="Tìm kiếm khóa học, học viên..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                      alt=""
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm font-medium">Giảng viên</span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Hồ sơ cá nhân
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Cài đặt
                    </button>
                    <button
                      onClick={() => {
                        navigate('/');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
