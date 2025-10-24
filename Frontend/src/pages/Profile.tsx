import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  Target,
  Star,
  Edit3,
  Camera,
  Share2,
  Settings,
  Play
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  joinDate: string;
  totalCourses: number;
  completedCourses: number;
  studyHours: number;
  achievements: number;
  rating: number;
  followers: number;
  following: number;
  isFollowing: boolean;
}

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  completedAt?: string;
  rating: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 123 456 789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=300&fit=crop',
    bio: 'Học viên đam mê công nghệ và lập trình. Luôn tìm kiếm cơ hội học hỏi và phát triển bản thân. Chuyên về React, Node.js và các công nghệ web hiện đại.',
    location: 'Hồ Chí Minh, Việt Nam',
    joinDate: '2024-01-15',
    totalCourses: 12,
    completedCourses: 8,
    studyHours: 156,
    achievements: 5,
    rating: 4.8,
    followers: 1247,
    following: 89,
    isFollowing: false
  });

  const [formData, setFormData] = useState({
    name: userProfile.name,
    bio: userProfile.bio,
    location: userProfile.location
  });

  // Mock courses data
  const courses: Course[] = [
    {
      id: '1',
      title: 'React Complete Guide 2024',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      progress: 100,
      completedAt: '2024-01-20',
      rating: 5
    },
    {
      id: '2',
      title: 'Node.js Backend Development',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
      progress: 85,
      rating: 4
    },
    {
      id: '3',
      title: 'TypeScript Fundamentals',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=200&fit=crop',
      progress: 100,
      completedAt: '2024-01-25',
      rating: 5
    },
    {
      id: '4',
      title: 'MongoDB & Express.js',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop',
      progress: 60,
      rating: 4
    }
  ];

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Course Completed',
      description: 'Hoàn thành khóa học đầu tiên',
      icon: '🎓',
      earnedAt: '2024-01-20',
      category: 'Learning'
    },
    {
      id: '2',
      title: 'Study Streak',
      description: 'Học liên tục 7 ngày',
      icon: '🔥',
      earnedAt: '2024-01-22',
      category: 'Consistency'
    },
    {
      id: '3',
      title: 'Perfect Score',
      description: 'Đạt điểm tuyệt đối trong quiz',
      icon: '⭐',
      earnedAt: '2024-01-25',
      category: 'Excellence'
    },
    {
      id: '4',
      title: 'Community Helper',
      description: 'Giúp đỡ 10 học viên khác',
      icon: '🤝',
      earnedAt: '2024-02-01',
      category: 'Community'
    },
    {
      id: '5',
      title: 'Early Bird',
      description: 'Học sớm 5 ngày liên tiếp',
      icon: '🌅',
      earnedAt: '2024-02-05',
      category: 'Habits'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'courses', label: 'Khóa học' },
    { id: 'achievements', label: 'Thành tích' },
    { id: 'activity', label: 'Hoạt động' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setUserProfile(prev => ({
      ...prev,
      name: formData.name,
      bio: formData.bio,
      location: formData.location
    }));
    setIsEditing(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{userProfile.totalCourses}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Khóa học</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{userProfile.completedCourses}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Hoàn thành</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{userProfile.studyHours}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Giờ học</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{userProfile.achievements}</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Thành tích</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {[
            { action: 'Hoàn thành khóa học', course: 'TypeScript Fundamentals', time: '2 giờ trước', icon: BookOpen },
            { action: 'Đạt thành tích', achievement: 'Perfect Score', time: '1 ngày trước', icon: Award },
            { action: 'Bắt đầu khóa học', course: 'MongoDB & Express.js', time: '3 ngày trước', icon: Play },
            { action: 'Đánh giá khóa học', course: 'React Complete Guide', time: '1 tuần trước', icon: Star }
          ].map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action} <span className="text-blue-600 dark:text-blue-400">{activity.course || activity.achievement}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                  {course.progress}%
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {course.title}
              </h3>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < course.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{course.rating}/5</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tiến độ</span>
                <span>{course.progress}%</span>
              </div>
              
              {course.completedAt && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                  ✓ Hoàn thành {new Date(course.completedAt).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {achievement.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {achievement.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(achievement.earnedAt).toLocaleDateString('vi-VN')}
              </div>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                  {achievement.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline hoạt động</h3>
        <div className="space-y-4">
          {[
            { date: '2024-02-05', action: 'Hoàn thành khóa học TypeScript Fundamentals', type: 'course' },
            { date: '2024-02-04', action: 'Đạt thành tích Perfect Score', type: 'achievement' },
            { date: '2024-02-03', action: 'Bắt đầu khóa học MongoDB & Express.js', type: 'course' },
            { date: '2024-02-01', action: 'Đạt thành tích Community Helper', type: 'achievement' },
            { date: '2024-01-30', action: 'Hoàn thành khóa học React Complete Guide', type: 'course' },
            { date: '2024-01-28', action: 'Đánh giá khóa học Node.js Backend Development', type: 'review' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.date).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCourses();
      case 'achievements':
        return renderAchievements();
      case 'activity':
        return renderActivity();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={userProfile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Cover Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Camera size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Settings size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              />
              <button className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full text-gray-600 dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">{userProfile.bio}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>{userProfile.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>Tham gia {new Date(userProfile.joinDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4 md:mt-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: userProfile.name,
                            bio: userProfile.bio,
                            location: userProfile.location
                          });
                        }}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Lưu
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                      >
                        <Edit3 size={16} />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <Share2 size={16} />
                        <span>Chia sẻ</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.followers}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Người theo dõi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.following}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Đang theo dõi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.rating}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.achievements}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Thành tích</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
