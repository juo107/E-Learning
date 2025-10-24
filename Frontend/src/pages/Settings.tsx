import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard, 
  Key, 
  Download,
  Eye,
  EyeOff,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Clock
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  totalCourses: number;
  completedCourses: number;
  studyHours: number;
  achievements: number;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 123 456 789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Học viên đam mê công nghệ và lập trình. Luôn tìm kiếm cơ hội học hỏi và phát triển bản thân.',
    location: 'Hồ Chí Minh, Việt Nam',
    joinDate: '2024-01-15',
    totalCourses: 12,
    completedCourses: 8,
    studyHours: 156,
    achievements: 5
  });

  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    bio: userProfile.bio,
    location: userProfile.location,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'account', label: 'Tài khoản', icon: User },
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'privacy', label: 'Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
    { id: 'language', label: 'Ngôn ngữ', icon: Globe },
    { id: 'billing', label: 'Thanh toán', icon: CreditCard }
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
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      location: formData.location
    }));
    setIsEditing(false);
    // Here you would typically make an API call to save the data
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin cơ bản</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Đổi mật khẩu</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hồ sơ cá nhân</h3>
        
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{userProfile.email}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userProfile.totalCourses}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Khóa học</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userProfile.completedCourses}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userProfile.studyHours}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Giờ học</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userProfile.achievements}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Thành tích</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin bổ sung</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giới thiệu bản thân
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Tham gia: {new Date(userProfile.joinDate).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cài đặt thông báo</h3>
        
        <div className="space-y-4">
          {[
            { id: 'email', label: 'Thông báo qua email', description: 'Nhận thông báo về khóa học mới, cập nhật và tin tức' },
            { id: 'push', label: 'Thông báo đẩy', description: 'Nhận thông báo trực tiếp trên thiết bị' },
            { id: 'sms', label: 'Thông báo SMS', description: 'Nhận thông báo quan trọng qua tin nhắn' },
            { id: 'marketing', label: 'Email marketing', description: 'Nhận thông tin về sản phẩm và dịch vụ mới' }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cài đặt bảo mật</h3>
        
        <div className="space-y-4">
          {[
            { id: 'profile', label: 'Hồ sơ công khai', description: 'Cho phép người khác xem hồ sơ của bạn' },
            { id: 'activity', label: 'Hoạt động học tập', description: 'Hiển thị tiến độ học tập cho người khác' },
            { id: 'achievements', label: 'Thành tích', description: 'Hiển thị thành tích và chứng chỉ' },
            { id: 'analytics', label: 'Phân tích dữ liệu', description: 'Cho phép sử dụng dữ liệu để cải thiện trải nghiệm' }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chủ đề</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Sáng', description: 'Chủ đề sáng' },
            { id: 'dark', label: 'Tối', description: 'Chủ đề tối' },
            { id: 'auto', label: 'Tự động', description: 'Theo hệ thống' }
          ].map((theme) => (
            <div key={theme.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                <div className="font-medium text-gray-900 dark:text-white">{theme.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{theme.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguageTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ngôn ngữ và khu vực</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngôn ngữ
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Khu vực
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="VN">Việt Nam</option>
              <option value="US">United States</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin thanh toán</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Visa **** 1234</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hết hạn 12/25</div>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Chỉnh sửa
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Mastercard **** 5678</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hết hạn 08/26</div>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              Xóa
            </button>
          </div>

          <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
            + Thêm phương thức thanh toán
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountTab();
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'language':
        return renderLanguageTab();
      case 'billing':
        return renderBillingTab();
      default:
        return renderAccountTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cài đặt</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Quản lý tài khoản và cài đặt cá nhân của bạn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              
              {activeTab === 'account' && (
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: userProfile.name,
                            email: userProfile.email,
                            phone: userProfile.phone,
                            bio: userProfile.bio,
                            location: userProfile.location,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span>Lưu thay đổi</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              )}
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
