import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  BookOpen
} from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      {/* Main Footer Content */}
      <div className="w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">E-Learning</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              Học tập trực tuyến hiệu quả với các khóa học chất lượng cao từ các chuyên gia hàng đầu.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Học tập</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Tất cả khóa học
                </Link>
              </li>
              <li>
                <Link to="/courses?category=development" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Lập trình
                </Link>
              </li>
              <li>
                <Link to="/courses?category=design" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Thiết kế
                </Link>
              </li>
              <li>
                <Link to="/courses?category=business" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Kinh doanh
                </Link>
              </li>
              <li>
                <Link to="/courses?featured=true" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Khóa học nổi bật
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Dạy trên nền tảng
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Công ty</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm">
                  Đối tác
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">support@elearning.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Điện thoại</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+84 123 456 789</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Địa chỉ</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">TP. Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} E-Learning Platform. Tất cả quyền được bảo lưu.
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select 
                  value={i18n.language} 
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                Điều khoản
              </Link>
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                Bảo mật
              </Link>
              <Link to="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}





