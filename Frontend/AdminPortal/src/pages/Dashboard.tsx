import { useEffect, useState } from 'react';
import {
  BookOpen,
  FolderTree,
  Users,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { getDashboardStats, DashboardStats } from '../services/adminService';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Mock chart data
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ];

  const enrollmentData = [
    { name: 'Week 1', enrollments: 120 },
    { name: 'Week 2', enrollments: 190 },
    { name: 'Week 3', enrollments: 150 },
    { name: 'Week 4', enrollments: 220 },
  ];

  const statCards = [
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      change: '+12%',
      trend: 'up',
      icon: BookOpen,
      color: 'indigo',
    },
    {
      title: 'Published',
      value: stats?.publishedCourses || 0,
      change: '+8%',
      trend: 'up',
      icon: Activity,
      color: 'emerald',
    },
    {
      title: 'Categories',
      value: stats?.totalCategories || 0,
      change: '+5%',
      trend: 'up',
      icon: FolderTree,
      color: 'purple',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    stat.color === 'indigo'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50'
                      : stat.color === 'emerald'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50'
                      : stat.color === 'purple'
                      ? 'bg-purple-50 dark:bg-purple-950/50'
                      : 'bg-blue-50 dark:bg-blue-950/50'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      stat.color === 'indigo'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : stat.color === 'emerald'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : stat.color === 'purple'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Overview
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last 6 months
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#6366f1"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#6366f1"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollments Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Enrollments
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Weekly trend
              </p>
            </div>
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey="enrollments"
                fill="#9333ea"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Courses
        </h3>
        <div className="space-y-3">
          {stats?.recentCourses.length ? (
            stats.recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {course.courseCode} • {course.durationInMinutes} min
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      course.isPublished
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${course.price}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No courses yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

