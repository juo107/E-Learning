import { useState, useRef, useEffect } from 'react';
import { Heart, ShoppingCart, Clock } from 'lucide-react';
import type { CourseCardDto } from '../../services/courses';
import { useCart } from '../../store/useCart';
import { addToCart, getCartItems, type CartItemDto } from '../../services/cart';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CourseHoverCardProps {
  course: CourseCardDto;
  isVisible: boolean;
  position?: { top: number; left: number };
  onClose?: () => void;
}

export default function CourseHoverCard({ course, isVisible, position, onClose }: CourseHoverCardProps) {
  const { add, items } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Load cart items to check if course is already in cart
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) return;
      try {
        const items = await getCartItems();
        setCartItems(items);
      } catch (err) {
        // Silently fail, will check localStorage cart instead
        console.error('Failed to load cart:', err);
      }
    };
    loadCart();
  }, [isAuthenticated]);

  // Format level text
  const getLevelText = (level?: string) => {
    if (!level) return null;
    const levelMap: { [key: string]: string } = {
      'Beginner': 'Sơ cấp',
      'Intermediate': 'Trung cấp',
      'Advanced': 'Nâng cao',
      'Sơ cấp': 'Sơ cấp',
      'Trung cấp': 'Trung cấp',
      'Nâng cao': 'Nâng cao'
    };
    return levelMap[level] || level;
  };

  // Format language text
  const getLanguageText = (language?: string) => {
    if (!language) return null;
    const languageMap: { [key: string]: string } = {
      'Vi': 'Tiếng Việt',
      'En': 'English',
      'Tiếng Việt': 'Tiếng Việt',
      'English': 'English'
    };
    return languageMap[language] || language;
  };

  // Format duration (from DurationInMinutes or calculate from course data)
  const getDurationText = () => {
    // If course has durationInMinutes field
    if ('durationInMinutes' in course && course.durationInMinutes) {
      const hours = course.durationInMinutes / 60;
      return hours >= 1 
        ? `${hours.toFixed(1)} giờ` 
        : `${course.durationInMinutes} phút`;
    }
    // Default text if no duration available
    return 'Nội dung đầy đủ';
  };

  // Format updated date
  const getUpdatedText = (date?: string) => {
    if (!date) return '';
    const updatedDate = new Date(date);
    const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
                    'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    return `Đã cập nhật ${months[updatedDate.getMonth()]} năm ${updatedDate.getFullYear()}`;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${course.courseId}` } });
      return;
    }

    // Check if course is already in cart
    const courseIdStr = course.courseId.toString();
    const isInBackendCart = cartItems.some(item => item.courseId === courseIdStr);
    const isInLocalCart = Object.keys(items).some(key => {
      const item = items[parseInt(key)];
      const itemCourseId = (item?.course as any)?.courseId ?? (item?.course as any)?.id;
      return itemCourseId?.toString() === courseIdStr;
    });

    if (isInBackendCart || isInLocalCart) {
      toast('Đã có trong giỏ hàng', {
        icon: '🛒',
        duration: 3000,
        style: {
          background: '#fbbf24',
          color: '#ffffff',
        },
      });
      return;
    }

    setAddingToCart(true);
    
    try {
      // Add to cart via API
      await addToCart(course.courseId.toString());
      
      // Reload cart items
      const updatedItems = await getCartItems();
      setCartItems(updatedItems);
      
      // Also add to local storage cart for immediate UI update
      const cartCourse = {
        id: course.courseId,
        courseId: course.courseId,
        title: course.title,
        price: course.price ?? 0,
        effectivePrice: course.finalPrice ?? course.price ?? course.effectivePrice ?? 0,
        thumbnailUrl: course.thumbnailUrl,
      } as any;
      add(cartCourse);
      
      toast.success('Đã thêm vào giỏ hàng!', {
        icon: '🛒',
        duration: 3000,
      });
    } catch (err: any) {
      toast.error(err?.message || 'Không thể thêm vào giỏ hàng', {
        duration: 4000,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  if (!isVisible) return null;


  return (
    <div
      ref={cardRef}
      className="fixed z-[9999] w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden pointer-events-auto transition-all duration-300 ease-out"
      style={{
        top: position?.top ? `${position.top}px` : 'auto',
        left: position?.left ? `${position.left}px` : 'auto',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        animation: isVisible ? 'hover-card-fade 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none'
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        // Cancel any pending close when hovering over card
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        // Tăng delay trước khi đóng để user có thời gian click vào button
        closeTimeoutRef.current = setTimeout(() => {
          onClose?.();
        }, 400); // Tăng từ 150ms lên 400ms
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 mb-2 transition-colors duration-200">
          {course.title}
        </h3>
        {course.createdAt && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getUpdatedText(course.createdAt)}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Course Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          {course.durationInMinutes && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Tổng số {getDurationText()}</span>
            </div>
          )}
          {course.level && getLevelText(course.level) && (
            <span>{getLevelText(course.level)}</span>
          )}
          {course.language && getLanguageText(course.language) && (
            <span>{getLanguageText(course.language)}</span>
          )}
        </div>

        {/* Description */}
        {course.shortDescription && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {course.shortDescription}
          </p>
        )}

        {/* Bullet Points - Course highlights */}
        <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
            <span>Truy cập trọn đời</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
            <span>Chứng chỉ hoàn thành</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
            <span>Dự án thực hành và bài tập</span>
          </li>
        </ul>
        
        {/* Rating Info */}
        {course.averageRating > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">
              {course.averageRating.toFixed(1)}
            </span>
            <div className="flex text-yellow-500">
              {'★'.repeat(Math.round(course.averageRating))}
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              ({course.ratingCount.toLocaleString()} đánh giá)
            </span>
          </div>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}</span>
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-2.5 rounded-lg border transition-all duration-200 transform hover:scale-110 active:scale-95 ${
              isWishlisted
                ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400 shadow-md'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-5 h-5 transition-all duration-200 ${isWishlisted ? 'fill-current scale-110' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

