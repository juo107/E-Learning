import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: FolderTree, label: 'Categories', path: '/categories' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            {sidebarOpen && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="flex-1 font-medium">{item.label}</span>
                  )}
                  {active && sidebarOpen && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'md:ml-0' : ''} transition-all duration-300`}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              {(() => {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const initial = user?.fullName?.[0] || user?.email?.[0] || 'A';
                return (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {initial.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.fullName || 'Admin'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || 'admin@elearn.com'}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

