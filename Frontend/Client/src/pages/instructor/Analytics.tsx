import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Star, 
  Eye,
  Target,
  Download,
  RefreshCw,
  BookOpen,
  Award,
  MessageCircle,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  students: number;
  revenue: number;
  views: number;
  completions: number;
  rating: number;
}

interface CoursePerformance {
  id: string;
  title: string;
  students: number;
  revenue: number;
  completionRate: number;
  rating: number;
  views: number;
  trend: 'up' | 'down' | 'stable';
}

const InstructorAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const analyticsData: AnalyticsData[] = [
    { period: '2024-01', students: 234, revenue: 12450, views: 5620, completions: 198, rating: 4.8 },
    { period: '2024-02', students: 312, revenue: 15680, views: 7230, completions: 245, rating: 4.9 },
    { period: '2024-03', students: 289, revenue: 14230, views: 6890, completions: 201, rating: 4.7 },
    { period: '2024-04', students: 456, revenue: 18920, views: 8920, completions: 312, rating: 4.9 },
    { period: '2024-05', students: 378, revenue: 16750, views: 7650, completions: 267, rating: 4.8 },
    { period: '2024-06', students: 423, revenue: 19840, views: 9120, completions: 298, rating: 4.9 }
  ];

  const coursePerformance: CoursePerformance[] = [
    {
      id: '1',
      title: 'React Complete Guide 2024',
      students: 1247,
      revenue: 12450,
      completionRate: 85,
      rating: 4.9,
      views: 5620,
      trend: 'up'
    },
    {
      id: '2',
      title: 'Node.js Backend Development',
      students: 892,
      revenue: 8920,
      completionRate: 72,
      rating: 4.7,
      views: 3420,
      trend: 'up'
    },
    {
      id: '3',
      title: 'TypeScript Fundamentals',
      students: 456,
      revenue: 4560,
      completionRate: 78,
      rating: 4.8,
      views: 2100,
      trend: 'stable'
    },
    {
      id: '4',
      title: 'MongoDB & Express.js',
      students: 234,
      revenue: 2340,
      completionRate: 65,
      rating: 4.6,
      views: 1200,
      trend: 'down'
    }
  ];

  const timeRanges = [
    { value: '7d', label: '7 ngày qua' },
    { value: '30d', label: '30 ngày qua' },
    { value: '90d', label: '90 ngày qua' },
    { value: '1y', label: '1 năm qua' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Thu nhập', icon: DollarSign, color: 'text-green-600' },
    { value: 'students', label: 'Học viên', icon: Users, color: 'text-blue-600' },
    { value: 'views', label: 'Lượt xem', icon: Eye, color: 'text-purple-600' },
    { value: 'completions', label: 'Hoàn thành', icon: Target, color: 'text-orange-600' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const currentData = analyticsData[analyticsData.length - 1];
  const previousData = analyticsData[analyticsData.length - 2];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowth(currentData.revenue, previousData.revenue);
  const studentsGrowth = calculateGrowth(currentData.students, previousData.students);
  const viewsGrowth = calculateGrowth(currentData.views, previousData.views);
  const completionsGrowth = calculateGrowth(currentData.completions, previousData.completions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Phân tích & Thống kê
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Theo dõi hiệu suất và hiểu rõ hơn về học viên của bạn
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
              
              <button className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
                <RefreshCw size={16} />
                <span>Làm mới</span>
              </button>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download size={16} />
                <span>Xuất báo cáo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng thu nhập</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${currentData.revenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {revenueGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Học viên mới</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentData.students.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {studentsGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${studentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(studentsGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lượt xem</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentData.views.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {viewsGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${viewsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(viewsGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hoàn thành</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentData.completions.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {completionsGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${completionsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(completionsGrowth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Biểu đồ hiệu suất</h3>
                <div className="flex items-center space-x-2">
                  {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <button
                        key={metric.value}
                        onClick={() => setSelectedMetric(metric.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedMetric === metric.value
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <Icon size={16} />
                          <span>{metric.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Simple Chart Representation */}
              <div className="h-64 flex items-end space-x-2">
                {analyticsData.map((data, index) => {
                  const value = data[selectedMetric as keyof AnalyticsData] as number;
                  const maxValue = Math.max(...analyticsData.map(d => d[selectedMetric as keyof AnalyticsData] as number));
                  const height = (value / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {data.period.split('-')[1]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Hiệu suất khóa học</h3>
              <div className="space-y-4">
                {coursePerformance.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{course.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{course.students.toLocaleString()} học viên</span>
                        <span>${course.revenue.toLocaleString()}</span>
                        <span>{course.completionRate}% hoàn thành</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(course.trend)}
                      <span className={`text-sm font-medium ${getTrendColor(course.trend)}`}>
                        {course.trend === 'up' ? 'Tăng' : course.trend === 'down' ? 'Giảm' : 'Ổn định'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Đánh giá tổng quan</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{currentData.rating}</div>
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(currentData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dựa trên 1,247 đánh giá</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thống kê nhanh</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tổng khóa học</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Chứng chỉ cấp</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Phản hồi</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">78%</span>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Đánh giá gần đây</h3>
              <div className="space-y-4">
                {[
                  { name: 'Nguyễn Văn A', rating: 5, comment: 'Khóa học rất hay và dễ hiểu!', course: 'React Complete Guide' },
                  { name: 'Trần Thị B', rating: 5, comment: 'Giảng viên nhiệt tình, nội dung chất lượng', course: 'Node.js Backend' },
                  { name: 'Lê Văn C', rating: 4, comment: 'Tốt nhưng cần thêm bài tập thực hành', course: 'TypeScript Fundamentals' }
                ].map((review, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{review.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{review.comment}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{review.course}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
