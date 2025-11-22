import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { isTenantAdmin, isContentAdmin, isSuperAdmin, getUserRole } from '../../utils/auth';
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
  Tag,
  Loader2,
  GraduationCap,
  UserCheck,
  DollarSign,
  Shield,
  TrendingUp,
  BarChart3,
  FileText,
  Key,
  Building2,
  MessageSquare,
  Award,
  CreditCard,
  Video,
  Search,
  AlertTriangle,
  PieChart,
  Globe,
  Bell,
  Headphones,
  QrCode,
  Plug,
  UsersRound,
} from 'lucide-react';

interface NavItem {
  icon: any;
  label: string;
  path: string;
  children?: NavItem[];
  section?: string;
  badge?: string;
}

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Force reload to update App.tsx authentication state
    window.location.href = '/login';
  };

  const toggleExpand = (path: string) => {
    setExpandedItems(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const navItems: NavItem[] = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      section: 'main'
    },
    {
      icon: Users,
      label: 'Users Management',
      path: '/users',
      section: 'management',
      children: [
        { icon: Users, label: 'All Users', path: '/users' },
        { icon: GraduationCap, label: 'Instructors', path: '/users/instructors' },
        { icon: UserCheck, label: 'Students', path: '/users/students' },
        { icon: Shield, label: 'Sub Admins', path: '/users/admins' },
      ],
    },
    {
      icon: BookOpen,
      label: 'Course Management',
      path: '/courses',
      section: 'management',
      children: [
        { icon: BookOpen, label: 'All Courses', path: '/courses' },
        { icon: Video, label: 'Videos & Files', path: '/courses/media' },
        { icon: FolderTree, label: 'Categories', path: '/categories' },
        { icon: BookOpen, label: 'Sections', path: '/sections' },
        { icon: Video, label: 'Lectures', path: '/lectures' },
        { icon: FileText, label: 'Resources', path: '/resources' },
      ],
    },
    {
      icon: DollarSign,
      label: 'Revenue & Payments',
      path: '/revenue',
      section: 'business',
      children: [
        { icon: TrendingUp, label: 'Revenue Overview', path: '/revenue' },
        { icon: CreditCard, label: 'Payouts', path: '/revenue/payouts' },
        { icon: FileText, label: 'Tax Management', path: '/revenue/tax' },
      ],
    },
    {
      icon: Shield,
      label: 'Moderation',
      path: '/moderation',
      section: 'business',
      children: [
        { icon: MessageSquare, label: 'Reviews', path: '/moderation/reviews' },
        { icon: AlertTriangle, label: 'Reports', path: '/moderation/reports' },
        { icon: Search, label: 'Content Check', path: '/moderation/content' },
      ],
    },
    { 
      icon: Tag, 
      label: 'Promotions', 
      path: '/promotions',
      section: 'business'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics',
      section: 'analytics',
      children: [
        { icon: PieChart, label: 'Course Analytics', path: '/analytics/courses' },
        { icon: TrendingUp, label: 'Platform Analytics', path: '/analytics/platform' },
      ],
    },
    {
      icon: Settings,
      label: 'Platform Settings',
      path: '/settings',
      section: 'system',
      children: [
        { icon: Settings, label: 'System Settings', path: '/settings/system' },
        { icon: Globe, label: 'Appearance', path: '/settings/appearance' },
        { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
      ],
    },
    {
      icon: Headphones,
      label: 'Support',
      path: '/support',
      section: 'system',
      children: [
        { icon: MessageSquare, label: 'Tickets', path: '/support/tickets' },
        { icon: BarChart3, label: 'SLA Reports', path: '/support/reports' },
      ],
    },
    {
      icon: Award,
      label: 'Certificates',
      path: '/certificates',
      section: 'system',
      children: [
        { icon: FileText, label: 'Templates', path: '/certificates/templates' },
        { icon: QrCode, label: 'Certificate Management', path: '/certificates' },
      ],
    },
    {
      icon: Plug,
      label: 'API & Integrations',
      path: '/integrations',
      section: 'system',
      children: [
        { icon: Key, label: 'API Keys', path: '/integrations/api-keys' },
        { icon: Plug, label: 'Webhooks', path: '/integrations/webhooks' },
        { icon: Building2, label: 'LMS Integration', path: '/integrations/lms' },
        { icon: Video, label: 'Live Streaming', path: '/integrations/streaming' },
        { icon: CreditCard, label: 'Payment Gateways', path: '/integrations/payments' },
      ],
    },
    {
      icon: Building2,
      label: 'Udemy Business',
      path: '/udemy-business',
      section: 'business',
      children: [
        { icon: UsersRound, label: 'Teams', path: '/udemy-business/teams' },
        { icon: BarChart3, label: 'Reports', path: '/udemy-business/reports' },
      ],
    },
  ];

  // Filter nav items based on user role
  const userRole = getUserRole();
  const filteredNavItems = navItems.filter(item => {
    // SystemSuperAdmin sees everything
    if (isSuperAdmin()) return true;
    
    // ContentAdmin only sees content management
    if (isContentAdmin()) {
      return item.path === '/dashboard' || 
             item.path === '/courses' || 
             item.path === '/sections' || 
             item.path === '/lectures' || 
             item.path === '/resources';
    }
    
    // TenantAdmin sees users, content, categories, promotions
    if (isTenantAdmin()) {
      return item.path === '/dashboard' ||
             item.path === '/users' ||
             item.path === '/courses' ||
             item.path === '/sections' ||
             item.path === '/lectures' ||
             item.path === '/resources' ||
             item.path === '/categories' ||
             item.path === '/promotions';
    }
    
    return false;
  });

  // Group items by section
  const groupedItems = filteredNavItems.reduce((acc, item) => {
    const section = item.section || 'other';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const sectionLabels: Record<string, string> = {
    main: 'Main',
    management: 'Management',
    business: 'Business',
    analytics: 'Analytics',
    system: 'System',
  };

  const isActive = (path: string) => location.pathname === path;
  
  const isParentActive = (item: NavItem) => {
    if (isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return false;
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Logging out...</p>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Portal
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">E-Learning Platform</p>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto scrollbar-none">
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section} className="space-y-1">
                {sidebarOpen && section !== 'main' && (
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {sectionLabels[section] || section}
                    </span>
                  </div>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedItems.includes(item.path);
                  const parentActive = isParentActive(item);
                  const active = isActive(item.path);

                  return (
                    <div key={item.path} className="relative">
                      {/* Active indicator */}
                      {(parentActive || active) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
                      )}
                      
                      <div className="flex items-center">
                        <Link
                          to={item.path}
                          onClick={(e) => {
                            setMobileOpen(false);
                            if (hasChildren) {
                              e.preventDefault();
                              toggleExpand(item.path);
                            }
                          }}
                          className={`group flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                            parentActive || active
                              ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-indigo-950/50 dark:to-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100'
                          }`}
                          title={!sidebarOpen ? item.label : undefined}
                        >
                          <div className={`relative ${parentActive || active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                            <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                            {(parentActive || active) && (
                              <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-sm -z-10" />
                            )}
                          </div>
                          {sidebarOpen && (
                            <>
                              <span className={`flex-1 font-medium text-sm transition-colors ${
                                parentActive || active
                                  ? 'text-indigo-700 dark:text-indigo-300'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {item.label}
                              </span>
                              {hasChildren && (
                                <ChevronRight
                                  className={`w-4 h-4 transition-all duration-200 ${
                                    isExpanded ? 'rotate-90 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'
                                  }`}
                                />
                              )}
                              {!hasChildren && (parentActive || active) && (
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                              )}
                            </>
                          )}
                        </Link>
                      </div>
                      
                      {/* Submenu */}
                      {hasChildren && sidebarOpen && isExpanded && (
                        <div className="ml-2 mt-1 space-y-0.5 pl-6 border-l-2 border-indigo-200/50 dark:border-indigo-800/50 animate-in slide-in-from-top-2 duration-200">
                          {item.children!.map((child, idx) => {
                            const ChildIcon = child.icon;
                            const childActive = isActive(child.path);
                            
                            return (
                              <Link
                                key={child.path}
                                to={child.path}
                                onClick={() => setMobileOpen(false)}
                                className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-sm relative ${
                                  childActive
                                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                                style={{ animationDelay: `${idx * 20}ms` }}
                              >
                                {childActive && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                                )}
                                <ChildIcon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                                  childActive 
                                    ? 'text-indigo-600 dark:text-indigo-400' 
                                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                }`} />
                                <span className="flex-1">{child.label}</span>
                                {childActive && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {section !== 'system' && sidebarOpen && (
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-2 mx-3" />
                )}
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              title={!sidebarOpen ? 'Logout' : undefined}
            >
              <div className="relative">
                {isLoggingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </div>
              {sidebarOpen && (
                <span className="font-medium text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              )}
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
      <main className={`flex-1 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300`}>
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
    </>
  );
}

