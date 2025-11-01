import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Star, 
  Eye,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Play,
  Pause,
  Trash2,
  Copy,
  ExternalLink,
  BarChart3
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: string;
  price: number;
  originalPrice?: number;
  students: number;
  rating: number;
  reviews: number;
  status: 'published' | 'draft' | 'pending' | 'archived';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  completionRate: number;
  revenue: number;
  views: number;
  duration: number; // in hours
  lessons: number;
}

const InstructorCourses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock courses data
  const courses: Course[] = [
    {
      id: '1',
      title: 'React Complete Guide 2024',
      description: 'Học React từ cơ bản đến nâng cao với các dự án thực tế',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      category: 'Web Development',
      level: 'Intermediate',
      price: 89,
      originalPrice: 129,
      students: 1247,
      rating: 4.9,
      reviews: 234,
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-02-01',
      publishedAt: '2024-01-20',
      completionRate: 85,
      revenue: 12450,
      views: 5620,
      duration: 24,
      lessons: 156
    },
    {
      id: '2',
      title: 'Node.js Backend Development',
      description: 'Xây dựng API và server với Node.js, Express, MongoDB',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
      category: 'Backend Development',
      level: 'Advanced',
      price: 79,
      students: 892,
      rating: 4.7,
      reviews: 156,
      status: 'published',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-28',
      publishedAt: '2024-01-15',
      completionRate: 72,
      revenue: 8920,
      views: 3420,
      duration: 18,
      lessons: 98
    },
    {
      id: '3',
      title: 'TypeScript Fundamentals',
      description: 'Lập trình TypeScript chuyên nghiệp cho JavaScript developers',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=200&fit=crop',
      category: 'Programming Languages',
      level: 'Beginner',
      price: 69,
      students: 456,
      rating: 4.8,
      reviews: 89,
      status: 'published',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-25',
      publishedAt: '2024-01-12',
      completionRate: 78,
      revenue: 4560,
      views: 2100,
      duration: 12,
      lessons: 67
    },
    {
      id: '4',
      title: 'MongoDB & Express.js',
      description: 'Xây dựng ứng dụng full-stack với MongoDB và Express.js',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop',
      category: 'Full Stack',
      level: 'Intermediate',
      price: 59,
      students: 234,
      rating: 4.6,
      reviews: 45,
      status: 'draft',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-05',
      completionRate: 0,
      revenue: 0,
      views: 120,
      duration: 15,
      lessons: 78
    },
    {
      id: '5',
      title: 'Vue.js 3 Complete Course',
      description: 'Học Vue.js 3 với Composition API và các tính năng mới',
      thumbnail: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=200&fit=crop',
      category: 'Frontend Development',
      level: 'Intermediate',
      price: 75,
      students: 0,
      rating: 0,
      reviews: 0,
      status: 'pending',
      createdAt: '2024-02-03',
      updatedAt: '2024-02-06',
      completionRate: 0,
      revenue: 0,
      views: 0,
      duration: 20,
      lessons: 120
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: courses.length },
    { value: 'published', label: 'Đã xuất bản', count: courses.filter(c => c.status === 'published').length },
    { value: 'draft', label: 'Bản nháp', count: courses.filter(c => c.status === 'draft').length },
    { value: 'pending', label: 'Chờ duyệt', count: courses.filter(c => c.status === 'pending').length },
    { value: 'archived', label: 'Đã lưu trữ', count: courses.filter(c => c.status === 'archived').length }
  ];

  const sortOptions = [
    { value: 'updated', label: 'Cập nhật gần nhất' },
    { value: 'created', label: 'Tạo mới nhất' },
    { value: 'title', label: 'Tên khóa học' },
    { value: 'students', label: 'Số học viên' },
    { value: 'revenue', label: 'Thu nhập' },
    { value: 'rating', label: 'Đánh giá' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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
      case 'archived':
        return 'Đã lưu trữ';
      default:
        return 'Không xác định';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'students':
        return b.students - a.students;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const totalStats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === 'published').length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    totalRevenue: courses.reduce((sum, c) => sum + c.revenue, 0),
    averageRating: courses.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / courses.filter(c => c.rating > 0).length || 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Quản lý khóa học
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Quản lý và theo dõi hiệu suất các khóa học của bạn
              </p>
            </div>
            
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus size={20} />
              <span>Tạo khóa học mới</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng khóa học</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đã xuất bản</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.publishedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng học viên</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng thu nhập</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đánh giá TB</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <BarChart3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <BookOpen size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {getStatusText(course.status)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      ${course.price}
                      {course.originalPrice && (
                        <span className="line-through text-gray-300 ml-1">${course.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users size={16} />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span>{course.rating || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{course.duration}h</span>
                      </div>
                    </div>

                    {course.status === 'published' && course.completionRate > 0 && (
                      <div>
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

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Cập nhật {new Date(course.updatedAt).toLocaleDateString('vi-VN')}
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedCourses.map((course) => (
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
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                            {course.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <div className="flex items-center space-x-1">
                              <Users size={16} />
                              <span>{course.students.toLocaleString()} học viên</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star size={16} className="text-yellow-400 fill-current" />
                              <span>{course.rating || 'N/A'} ({course.reviews} đánh giá)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign size={16} />
                              <span>${course.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={16} />
                              <span>{course.duration}h • {course.lessons} bài</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                              {getStatusText(course.status)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                              {course.level}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Cập nhật {new Date(course.updatedAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            Chỉnh sửa
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sortedCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Tạo khóa học đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourses;
