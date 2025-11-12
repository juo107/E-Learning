import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../store/useCart';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { getCartItems, removeFromCart, type CartItemDto } from '../../services/cart';
import toast from 'react-hot-toast';
import type { Course } from '../../types/course';

interface CartPopoverProps {
  children: React.ReactNode;
}

export default function CartPopover({ children }: CartPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { items, remove } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [backendCartItems, setBackendCartItems] = useState<CartItemDto[]>([]);

  // Load cart items from backend if authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setBackendCartItems([]);
        return;
      }
      try {
        const items = await getCartItems();
        setBackendCartItems(items);
      } catch (err) {
        console.error('Failed to load cart:', err);
        setBackendCartItems([]);
      }
    };
    loadCart();
    
    // Reload when popover opens
    if (isOpen) {
      loadCart();
    }
  }, [isAuthenticated, isOpen]);

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
        } as unknown as Course,
      }))
    : Object.values(items).map(item => ({
        course: item.course,
      }));

  // Count items (each course = 1, no quantity)
  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = (item.course as Course).discountPrice ?? (item.course as Course).price;
    return sum + price;
  }, 0);

  // Handle hover with smooth animation
  const handleMouseEnter = () => {
    // Clear any pending close timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Small delay before opening (Udemy style)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
      // Trigger animation after a tiny delay
      setTimeout(() => setIsVisible(true), 10);
    }, 100); // Small delay for smoother UX
  };

  const handleMouseLeave = () => {
    // Clear hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Start closing animation with longer delay to allow moving mouse to popover
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      // Close after animation completes
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }, 400); // Increased delay to allow moving mouse to popover
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        popoverRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 200);
      }
    };

    if (isOpen) {
      // Small delay to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleRemove = async (e: React.MouseEvent, courseId: number | string) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cart Icon with Badge */}
      <div className="relative">
        {children}
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>

      {/* Invisible bridge area to prevent gap between icon and popover */}
      {isOpen && (
        <div
          className="absolute right-0 top-full w-80 sm:w-96 h-2 z-[99]"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            setIsVisible(true);
          }}
        />
      )}

      {/* Popover with smooth animation */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute right-0 top-full mt-0 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[100] overflow-hidden transition-all duration-200 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          onMouseEnter={() => {
            // Keep open when hovering over popover - clear any pending close
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            setIsVisible(true);
          }}
          onMouseLeave={() => {
            // Delay closing when leaving popover
            timeoutRef.current = setTimeout(() => {
              setIsVisible(false);
              setTimeout(() => {
                setIsOpen(false);
              }, 200);
            }, 400); // Increased delay
          }}
        >
          <div className="max-h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t('cart.title')} ({totalItems})
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                aria-label={t('common.close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {t('cart.empty')}
                  </p>
                  <Link
                    to="/courses"
                    className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {t('cart.browseCourses')}
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => {
                    const course = item.course as Course;
                    const courseId = course.courseId ?? (course as any).id;
                    const price = course.discountPrice ?? course.price;
                    
                    return (
                      <div
                        key={courseId}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          <Link
                            to={`/course/${courseId}`}
                            className="flex-shrink-0"
                            onClick={() => setIsOpen(false)}
                          >
                            <img
                              src={course.thumbnailUrl || 'https://via.placeholder.com/80x60'}
                              alt={course.title}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                          </Link>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/course/${courseId}`}
                              className="block"
                              onClick={() => setIsOpen(false)}
                            >
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                                {course.title}
                              </h4>
                            </Link>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                {formatPrice(price)}
                              </div>
                              <button
                                onClick={(e) => handleRemove(e, courseId)}
                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                aria-label={t('cart.remove')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('cart.total')}:
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {t('cart.checkout')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

