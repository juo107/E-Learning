import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { fetchCourseById, type CourseDetailDto } from '../services/courses';
import { createOrder } from '../services/order';
import { createPayment, type CreatePaymentDto } from '../services/payment';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, QrCode, Globe, ArrowLeft, Loader2, Lock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

type PaymentMethod = 'ATM' | 'QR' | 'INTL';

const paymentMethods: { value: PaymentMethod; label: string; icon: any; description: string }[] = [
  {
    value: 'ATM',
    label: 'Thẻ ATM',
    icon: CreditCard,
    description: 'Thanh toán qua thẻ ATM nội địa',
  },
  {
    value: 'QR',
    label: 'QR Code',
    icon: QrCode,
    description: 'Quét mã QR để thanh toán',
  },
  {
    value: 'INTL',
    label: 'Thẻ quốc tế',
    icon: Globe,
    description: 'Visa, Mastercard, JCB',
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [courses, setCourses] = useState<CourseDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('ATM');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const courseIds = location.state?.courseIds || [];
    
    if (courseIds.length === 0) {
      setError('Không có khóa học nào để thanh toán');
      setLoading(false);
      return;
    }

    const loadCourses = async () => {
      try {
        setLoading(true);
        const coursePromises = courseIds.map((id: string) => fetchCourseById(id));
        const courseData = await Promise.all(coursePromises);
        setCourses(courseData);
      } catch (err: any) {
        setError(err?.message || 'Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [isAuthenticated, navigate, location]);

  const subtotal = courses.reduce((sum, course) => {
    return sum + (course.finalPrice ?? course.price ?? 0);
  }, 0);

  const total = subtotal;

  const handlePayment = async () => {
    if (courses.length === 0) {
      toast.error('Không có khóa học nào để thanh toán');
      return;
    }

    setProcessing(true);
    
    try {
      const courseIds = courses.map(c => c.courseId.toString());
      const order = await createOrder(courseIds);
      
      const paymentDto: CreatePaymentDto = {
        orderId: order.id,
        paymentMethod: selectedPaymentMethod,
      };
      
      const payment = await createPayment(paymentDto);
      
      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      } else {
        throw new Error('Payment URL not found');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tạo thanh toán');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || courses.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Không có khóa học nào để thanh toán'}
          </h1>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Quay lại</span>
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Thanh toán
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Bảo mật 100%</span>
            </div>
          </div>
        </div>

        {/* Main Content - Fit in viewport */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto px-6 py-4">
            <div className="h-full grid grid-cols-12 gap-6">
              {/* Left Column - Courses & Payment */}
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 overflow-hidden">
                {/* Courses List - Scrollable */}
                <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Khóa học đã chọn ({courses.length})
                    </h2>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {courses.map((course) => (
                        <div
                          key={course.courseId}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex gap-3">
                            <img
                              src={course.thumbnailUrl || `https://picsum.photos/seed/${course.courseId}/120/68`}
                              alt={course.title}
                              className="w-20 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                                {course.title}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {course.instructor?.fullName || 'N/A'}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {course.hasDiscount && course.finalPrice ? (
                                <>
                                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                      maximumFractionDigits: 0,
                                    }).format(course.finalPrice)}
                                  </div>
                                  <div className="text-xs text-gray-400 line-through">
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                      maximumFractionDigits: 0,
                                    }).format(course.price ?? 0)}
                                  </div>
                                </>
                              ) : (
                                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                  {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                    maximumFractionDigits: 0,
                                  }).format(course.price ?? 0)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Methods - Compact */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 overflow-hidden flex flex-col">
                  <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Phương thức thanh toán
                    </h2>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedPaymentMethod === method.value;
                        
                        return (
                          <button
                            key={method.value}
                            onClick={() => setSelectedPaymentMethod(method.value)}
                            className={`group relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-sm'
                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? 'border-indigo-500 bg-indigo-500 shadow-sm'
                                  : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-400'
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div className={`p-1.5 rounded-lg ${
                              isSelected
                                ? 'bg-indigo-100 dark:bg-indigo-900/50'
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Icon
                                className={`w-4 h-4 ${
                                  isSelected
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <div
                                className={`text-sm font-semibold ${
                                  isSelected
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {method.label}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {method.description}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="col-span-12 lg:col-span-5 flex flex-col">
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <h2 className="text-lg font-bold text-white">
                      Tóm tắt đơn hàng
                    </h2>
                  </div>
                  
                  <div className="flex-1 p-5 flex flex-col">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tạm tính:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumFractionDigits: 0,
                          }).format(subtotal)}
                        </span>
                      </div>
                      <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          Tổng cộng:
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumFractionDigits: 0,
                          }).format(total)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto space-y-3">
                      <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 transform hover:scale-[1.02] disabled:scale-100"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Đang xử lý...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Thanh toán ngay</span>
                          </>
                        )}
                      </button>

                      <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                        Bằng cách thanh toán, bạn đồng ý với{' '}
                        <Link
                          to="/legal/terms"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          Điều khoản sử dụng
                        </Link>{' '}
                        của chúng tôi
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
