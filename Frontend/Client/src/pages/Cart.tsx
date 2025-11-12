import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { getCartItems, removeFromCart, clearCart, type CartItemDto } from '../services/cart';
import toast from 'react-hot-toast';
import type { Course } from '../types/course';

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, remove, clear } = useCart();
  const [backendCartItems, setBackendCartItems] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from backend if authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const backendItems = await getCartItems();
        setBackendCartItems(backendItems);
      } catch (err: any) {
        console.error('Failed to load cart from backend:', err);
        // Continue with localStorage cart if backend fails
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Use backend cart items if available, otherwise use localStorage cart
  const cartItems = isAuthenticated && backendCartItems.length > 0
    ? backendCartItems.map(item => ({
        course: {
          courseId: parseInt(item.courseId) || 0,
          id: item.courseId,
          title: item.courseTitle,
          thumbnailUrl: item.courseThumbnailUrl || undefined,
          price: item.currentPrice,
          discountPrice: item.currentPrice < item.priceAtAdd ? item.currentPrice : undefined,
          slug: '',
          shortDescription: '',
          language: '',
          averageRating: 0,
          ratingCount: 0,
          viewCount: 0,
          enrollmentCount: 0,
          isPublished: true,
          isFeatured: false,
          createdAt: item.addedAt,
          updatedAt: item.addedAt,
          // Legacy fields
          totalRatings: 0,
          totalStudents: 0,
          instructorName: '',
          instructorId: '',
          categoryId: undefined,
          categoryName: '',
          level: '',
          duration: 0,
          lessonsCount: 0,
        } as unknown as Course,
      }))
    : Object.values(items).map(item => ({
        course: item.course,
      }));

  const totalItems = cartItems.length;
  
  const subtotal = cartItems.reduce((sum, item) => {
    const price = (item.course as Course).discountPrice ?? (item.course as Course).price;
    return sum + price;
  }, 0);

  // No tax for now, or can be added later
  const discount = 0; // Can add coupon discount later
  const total = subtotal - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleRemove = async (courseId: number | string) => {
    if (isAuthenticated && backendCartItems.length > 0) {
      try {
        const cartItem = backendCartItems.find(item => item.courseId === courseId.toString());
        if (cartItem) {
          await removeFromCart(cartItem.id);
          setBackendCartItems(prev => prev.filter(item => item.id !== cartItem.id));
          toast.success('Đã xóa khỏi giỏ hàng');
        }
      } catch (err: any) {
        toast.error(err?.message || 'Không thể xóa khỏi giỏ hàng');
      }
    } else {
      remove(courseId as number);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm(t('cart.confirmClear'))) {
      return;
    }

    if (isAuthenticated && backendCartItems.length > 0) {
      try {
        await clearCart();
        setBackendCartItems([]);
        toast.success('Đã xóa tất cả khỏi giỏ hàng');
      } catch (err: any) {
        toast.error(err?.message || 'Không thể xóa giỏ hàng');
      }
    } else {
      clear();
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    // Lấy course IDs từ cart items
    const courseIds = cartItems.map(item => {
      const course = item.course as Course;
      return course.courseId?.toString() ?? '0';
    }).filter(id => id !== '0');

    // Redirect đến trang checkout
    navigate('/checkout', {
      state: {
        courseIds,
        fromCart: true, // Flag để biết là từ cart
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t('cart.emptyCart')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            {t('cart.emptyDescription')}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('cart.browseCourses')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('cart.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('cart.itemsCount', { count: totalItems })}
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            {t('cart.clearAll')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {cartItems.map((item) => {
              const course = item.course as Course;
              const courseId = course.courseId ?? (course as any).id;
              const price = course.discountPrice ?? course.price;
              
              return (
                <div key={courseId} className="p-6">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <Link
                      to={`/course/${courseId}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={course.thumbnailUrl || 'https://via.placeholder.com/120x80'}
                        alt={course.title}
                        className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/course/${courseId}`}
                        className="block mb-2"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {course.title}
                        </h3>
                      </Link>
                      
                      {course.shortDescription && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {course.shortDescription}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {/* Price */}
                        <div>
                          {course.discountPrice && course.discountPrice < course.price && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                {formatPrice(course.price)}
                              </span>
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded">
                                {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% OFF
                              </span>
                            </div>
                          )}
                          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {formatPrice(price)}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(courseId)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('cart.orderSummary')}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>{t('cart.total')}</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="mb-4 p-3 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                Vui lòng đăng nhập để thanh toán
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={!isAuthenticated || cartItems.length === 0}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {t('cart.checkout')}
            </button>

            <Link
              to="/courses"
              className="block w-full py-3 px-4 text-center border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

