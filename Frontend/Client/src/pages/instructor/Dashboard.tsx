import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Clock, 
  Award,
  Eye,
  MessageCircle,
  Download,
  Plus,
  BarChart3,
  Calendar,
  Target,
  Zap,
  ChevronRight,
  Play,
  Pause,
  Edit3,
  MoreHorizontal
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  students: number;
  rating: number;
  price: number;
  status: 'published' | 'draft' | 'pending';
  lastUpdated: string;
  completionRate: number;
  revenue: number;
}

interface Analytics {
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  averageRating: number;
  monthlyRevenue: number;
  monthlyStudents: number;
  completionRate: number;
  totalViews: number;
}

const InstructorDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock analytics data
  const analytics: Analytics = {
    totalStudents: 2847,
    totalRevenue: 45680,
    totalCourses: 12,
    averageRating: 4.8,
    monthlyRevenue: 12450,
    monthlyStudents: 234,
    completionRate: 78,
    totalViews: 15620
  };

  // Mock courses data
  const courses: Course[] = [
    {
      id: '1',
      title: 'React Complete Guide 2024',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      students: 1247,
      rating: 4.9,
      price: 89,
      status: 'published',
      lastUpdated: '2024-02-01',
      completionRate: 85,
      revenue: 12450
    },
    {
      id: '2',
      title: 'Node.js Backend Development',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
      students: 892,
      rating: 4.7,
      price: 79,
      status: 'published',
      lastUpdated: '2024-01-28',
      completionRate: 72,
      revenue: 8920
    },
    {
      id: '3',
      title: 'TypeScript Fundamentals',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=200&fit=crop',
      students: 456,
      rating: 4.8,
      price: 69,
      status: 'published',
      lastUpdated: '2024-01-25',
      completionRate: 78,
      revenue: 4560
    },
    {
      id: '4',
      title: 'MongoDB & Express.js',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop',
      students: 234,
      rating: 4.6,
      price: 59,
      status: 'draft',
      lastUpdated: '2024-02-05',
      completionRate: 0,
      revenue: 0
    }
  ];

  const recentActivities = [
    { id: '1', type: 'enrollment', message: '15 học viên mới đăng ký khóa học React Complete Guide', time: '2 giờ trước', icon: Users },
    { id: '2', type: 'review', message: 'Nhận đánh giá 5 sao từ học viên trong khóa Node.js', time: '4 giờ trước', icon: Star },
    { id: '3', type: 'revenue', message: 'Thu nhập $450 từ khóa TypeScript Fundamentals', time: '1 ngày trước', icon: DollarSign },
    { id: '4', type: 'completion', message: 'Học viên hoàn thành khóa React Complete Guide', time: '2 ngày trước', icon: Award },
    { id: '5', type: 'course', message: 'Cập nhật nội dung khóa MongoDB & Express.js', time: '3 ngày trước', icon: Edit3 }
  ];

  const timeRanges = [
    { value: '7d', label: '7 ngày qua' },
    { value: '30d', label: '30 ngày qua' },
    { value: '90d', label: '90 ngày qua' },
    { value: '1y', label: '1 năm qua' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản';
      case 'draft':
        return 'Bản nháp';
      case 'pending':
        return 'Chờ duyệt';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard Giảng viên
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Quản lý khóa học và theo dõi hiệu suất giảng dạy
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus size={20} />
                <span>Tạo khóa học</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tổng học viên</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{analytics.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  +{analytics.monthlyStudents} tháng này
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Tổng thu nhập</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">${analytics.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +${analytics.monthlyRevenue.toLocaleString()} tháng này
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Khóa học</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{analytics.totalCourses}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  {courses.filter(c => c.status === 'published').length} đã xuất bản
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Đánh giá TB</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{analytics.averageRating}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  {analytics.completionRate}% hoàn thành
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Khóa học của tôi</h3>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                    Xem tất cả
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {courses.map((course) => (
                  <div key={course.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                              {course.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <div className="flex items-center space-x-1">
                                <Users size={16} />
                                <span>{course.students.toLocaleString()} học viên</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star size={16} className="text-yellow-400 fill-current" />
                                <span>{course.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign size={16} />
                                <span>${course.revenue.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                {getStatusText(course.status)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Cập nhật {new Date(course.lastUpdated).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {course.status === 'published' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>Tiến độ hoàn thành</span>
                              <span>{course.completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Tạo khóa học mới</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bắt đầu tạo nội dung</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Xem phân tích</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Thống kê chi tiết</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Thu nhập</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Xem báo cáo tài chính</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hoạt động gần đây</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tóm tắt hiệu suất</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tổng lượt xem</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analytics.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analytics.completionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Đánh giá trung bình</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900 dark:text-white">{analytics.averageRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thu nhập tháng này</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${analytics.monthlyRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
