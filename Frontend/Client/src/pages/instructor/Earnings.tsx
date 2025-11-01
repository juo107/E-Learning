import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  CreditCard,
  Banknote,
  PieChart,
  BarChart3,
  Target,
  Clock,
  BookOpen,
  Users,
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface Earning {
  id: string;
  date: string;
  course: string;
  students: number;
  revenue: number;
  commission: number;
  netEarning: number;
  status: 'pending' | 'paid' | 'processing';
}

interface MonthlyEarning {
  month: string;
  grossRevenue: number;
  platformFee: number;
  netEarning: number;
  students: number;
  courses: number;
}

const InstructorEarnings: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [viewMode, setViewMode] = useState<'overview' | 'transactions' | 'courses'>('overview');

  // Mock earnings data
  const monthlyEarnings: MonthlyEarning[] = [
    { month: '2024-01', grossRevenue: 12450, platformFee: 1245, netEarning: 11205, students: 234, courses: 3 },
    { month: '2024-02', grossRevenue: 15680, platformFee: 1568, netEarning: 14112, students: 312, courses: 4 },
    { month: '2024-03', grossRevenue: 14230, platformFee: 1423, netEarning: 12807, students: 289, courses: 3 },
    { month: '2024-04', grossRevenue: 18920, platformFee: 1892, netEarning: 17028, students: 456, courses: 4 },
    { month: '2024-05', grossRevenue: 16750, platformFee: 1675, netEarning: 15075, students: 378, courses: 3 },
    { month: '2024-06', grossRevenue: 19840, platformFee: 1984, netEarning: 17856, students: 423, courses: 4 }
  ];

  const recentEarnings: Earning[] = [
    {
      id: '1',
      date: '2024-02-15',
      course: 'React Complete Guide 2024',
      students: 15,
      revenue: 1335,
      commission: 133.5,
      netEarning: 1201.5,
      status: 'paid'
    },
    {
      id: '2',
      date: '2024-02-14',
      course: 'Node.js Backend Development',
      students: 8,
      revenue: 632,
      commission: 63.2,
      netEarning: 568.8,
      status: 'paid'
    },
    {
      id: '3',
      date: '2024-02-13',
      course: 'TypeScript Fundamentals',
      students: 12,
      revenue: 828,
      commission: 82.8,
      netEarning: 745.2,
      status: 'paid'
    },
    {
      id: '4',
      date: '2024-02-12',
      course: 'MongoDB & Express.js',
      students: 5,
      revenue: 295,
      commission: 29.5,
      netEarning: 265.5,
      status: 'processing'
    },
    {
      id: '5',
      date: '2024-02-11',
      course: 'React Complete Guide 2024',
      students: 20,
      revenue: 1780,
      commission: 178,
      netEarning: 1602,
      status: 'pending'
    }
  ];

  const courseEarnings = [
    {
      id: '1',
      title: 'React Complete Guide 2024',
      totalRevenue: 12450,
      totalStudents: 1247,
      averagePrice: 89,
      completionRate: 85,
      rating: 4.9,
      lastSale: '2024-02-15'
    },
    {
      id: '2',
      title: 'Node.js Backend Development',
      totalRevenue: 8920,
      totalStudents: 892,
      averagePrice: 79,
      completionRate: 72,
      rating: 4.7,
      lastSale: '2024-02-14'
    },
    {
      id: '3',
      title: 'TypeScript Fundamentals',
      totalRevenue: 4560,
      totalStudents: 456,
      averagePrice: 69,
      completionRate: 78,
      rating: 4.8,
      lastSale: '2024-02-13'
    },
    {
      id: '4',
      title: 'MongoDB & Express.js',
      totalRevenue: 2340,
      totalStudents: 234,
      averagePrice: 59,
      completionRate: 65,
      rating: 4.6,
      lastSale: '2024-02-12'
    }
  ];

  const timeRanges = [
    { value: '7d', label: '7 ngày qua' },
    { value: '30d', label: '30 ngày qua' },
    { value: '90d', label: '90 ngày qua' },
    { value: '1y', label: '1 năm qua' }
  ];

  const currentMonth = monthlyEarnings[monthlyEarnings.length - 1];
  const previousMonth = monthlyEarnings[monthlyEarnings.length - 2];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowth(currentMonth.grossRevenue, previousMonth.grossRevenue);
  const earningGrowth = calculateGrowth(currentMonth.netEarning, previousMonth.netEarning);
  const studentsGrowth = calculateGrowth(currentMonth.students, previousMonth.students);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ thanh toán';
      default:
        return 'Không xác định';
    }
  };

  const totalEarnings = monthlyEarnings.reduce((sum, month) => sum + month.netEarning, 0);
  const totalRevenue = monthlyEarnings.reduce((sum, month) => sum + month.grossRevenue, 0);
  const totalStudents = monthlyEarnings.reduce((sum, month) => sum + month.students, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Thu nhập & Thanh toán
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Theo dõi thu nhập và quản lý thanh toán từ các khóa học
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

        {/* View Mode Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Tổng quan', icon: PieChart },
                { id: 'transactions', label: 'Giao dịch', icon: CreditCard },
                { id: 'courses', label: 'Theo khóa học', icon: BookOpen }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      viewMode === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng thu nhập</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalEarnings.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {earningGrowth >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${earningGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(earningGrowth).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">tháng này</span>
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Doanh thu thô</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {revenueGrowth >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(revenueGrowth).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">tháng này</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Học viên</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStudents.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {studentsGrowth >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${studentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(studentsGrowth).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">tháng này</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Phí nền tảng</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">10%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      ${((totalRevenue - totalEarnings) / totalRevenue * 100).toFixed(0)} tổng phí
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Thu nhập theo tháng</h3>
              <div className="h-64 flex items-end space-x-2">
                {monthlyEarnings.map((month, index) => {
                  const maxEarning = Math.max(...monthlyEarnings.map(m => m.netEarning));
                  const height = (month.netEarning / maxEarning) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {month.month.split('-')[1]}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ${(month.netEarning / 1000).toFixed(0)}k
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Transactions Tab */}
        {viewMode === 'transactions' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Giao dịch gần đây</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentEarnings.map((earning) => (
                <div key={earning.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{earning.course}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span>{earning.students} học viên</span>
                            <span>Doanh thu: ${earning.revenue.toLocaleString()}</span>
                            <span>Phí: ${earning.commission.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${earning.netEarning.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(earning.date).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                        {getStatusText(earning.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {viewMode === 'courses' && (
          <div className="space-y-6">
            {courseEarnings.map((course) => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tổng thu nhập</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${course.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Học viên</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{course.totalStudents.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Giá trung bình</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${course.averagePrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{course.completionRate}%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                      <span>Bán cuối: {new Date(course.lastSale).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin thanh toán</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Phương thức thanh toán</h4>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Ngân hàng ACB</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">**** 1234</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Lịch thanh toán</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Thanh toán hàng tháng vào ngày 15</p>
                <p>Thanh toán tiếp theo: 15/03/2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorEarnings;
