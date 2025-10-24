import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Play, Pause, RefreshCw, AlertCircle } from 'lucide-react';
import RealtimeLine from '../../components/admin/charts/RealtimeLine';
import RegionDonut from '../../components/admin/charts/RegionDonut';
import { useRealtime } from '../../store/useRealtime';

export default function AdminDashboard() {
  const { 
    kpiData, 
    recentEvents, 
    isLoading, 
    error, 
    isLiveMode, 
    fetchKpiData, 
    toggleLiveMode, 
    clearError 
  } = useRealtime();

  useEffect(() => {
    fetchKpiData();
  }, [fetchKpiData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'USER_LOGIN': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'ORDER_CREATED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'COURSE_ENROLLED': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'ERROR_RAISED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'REVIEW_ADDED': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time statistics and system monitoring
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchKpiData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={toggleLiveMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isLiveMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {isLiveMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isLiveMode ? 'Stop Live' : 'Start Live'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(kpiData ? [
          { 
            label: 'Total Users', 
            value: formatNumber(kpiData.totalUsers), 
            delta: `+${kpiData.activeUsers24h} active today`, 
            color: 'text-indigo-600',
            icon: '👥'
          },
          { 
            label: 'Total Courses', 
            value: formatNumber(kpiData.totalCourses), 
            delta: `${kpiData.publishedCourses} published, ${kpiData.pendingCourses} pending`, 
            color: 'text-emerald-600',
            icon: '📚'
          },
          { 
            label: 'Enrollments', 
            value: formatNumber(kpiData.totalEnrollments), 
            delta: `Avg rating: ${kpiData.averageRating}/5`, 
            color: 'text-amber-600',
            icon: '🎓'
          },
          { 
            label: 'Reviews', 
            value: formatNumber(kpiData.reviewsCount), 
            delta: `Last updated: ${new Date(kpiData.generatedAtUtc).toLocaleTimeString('vi-VN')}`, 
            color: 'text-fuchsia-600',
            icon: '⭐'
          },
        ] : [
          { label: 'Loading...', value: '...', delta: '...', color: 'text-gray-400', icon: '⏳' },
          { label: 'Loading...', value: '...', delta: '...', color: 'text-gray-400', icon: '⏳' },
          { label: 'Loading...', value: '...', delta: '...', color: 'text-gray-400', icon: '⏳' },
          { label: 'Loading...', value: '...', delta: '...', color: 'text-gray-400', icon: '⏳' },
        ]).map((kpi, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</div>
              <div className="text-lg">{kpi.icon}</div>
            </div>
            <div className="mt-1 text-2xl font-semibold">{kpi.value}</div>
            <div className={`mt-1 text-xs ${kpi.color}`}>{kpi.delta}</div>
            {/* Mini sparkline */}
            <div className="mt-3 h-10">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <polyline 
                  fill="none" 
                  stroke="currentColor" 
                  className={kpi.color} 
                  strokeWidth="2" 
                  points="0,20 10,18 20,22 30,16 40,14 50,12 60,15 70,10 80,12 90,9 100,11" 
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <RealtimeLine 
            title="Active Users (Real-time)" 
            subtitle="last 15 minutes" 
            dataKey="activeUsersChart"
            color="#6366F1"
          />
        </div>
        <RegionDonut title="Traffic by Region" />
      </div>

      {/* Revenue Chart */}
      <div className="mb-6">
        <RealtimeLine 
          title="Revenue (Real-time)" 
          subtitle="last 15 minutes" 
          dataKey="revenueChart"
          color="#10B981"
        />
      </div>

      {/* Event feed + Top table */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">Recent Events</div>
            {isLiveMode && (
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live updates
              </div>
            )}
          </div>
          <div className="text-sm divide-y divide-gray-200 dark:divide-gray-800 max-h-80 overflow-y-auto">
            {recentEvents.length > 0 ? recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-2">
                <div className="text-gray-600 dark:text-gray-400">
                  {new Date(event.timestamp).toLocaleTimeString('vi-VN')}
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-md text-xs ${getEventBadgeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <div className="truncate text-gray-600 dark:text-gray-400 max-w-xs">
                  {event.message}
                </div>
                {event.metadata && (
                  <div className="text-xs text-gray-500">
                    {JSON.stringify(event.metadata)}
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No recent events
              </div>
            )}
          </div>
        </div>
        
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="font-semibold mb-4">System Health</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Redis Cache</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Limited</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">~45ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/admin/courses" className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950 hover:shadow-md transition-shadow">
          <div className="font-semibold flex items-center gap-2">
            📚 Courses
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Manage, approve/reject, publish</div>
        </Link>
        <Link to="/admin/categories" className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950 hover:shadow-md transition-shadow">
          <div className="font-semibold flex items-center gap-2">
            🏷️ Categories
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Create, update, delete</div>
        </Link>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="font-semibold flex items-center gap-2">
            📊 Analytics
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Detailed reports and insights</div>
        </div>
      </div>
    </div>
  );
}



