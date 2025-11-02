import { useState, useRef, useEffect } from 'react';
import { Heart, ShoppingCart, Clock } from 'lucide-react';
import type { CourseCardDto } from '../../services/courses';
import { useCart } from '../../store/useCart';

interface CourseHoverCardProps {
  course: CourseCardDto;
  isVisible: boolean;
  position?: { top: number; left: number };
  onClose?: () => void;
}

export default function CourseHoverCard({ course, isVisible, position, onClose }: CourseHoverCardProps) {
  const { add } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Convert CourseCardDto to Course format for cart
    const cartCourse = {
      id: course.courseId,
      courseId: course.courseId,
      title: course.title,
      price: course.price ?? 0,
      effectivePrice: course.finalPrice ?? course.price ?? course.effectivePrice ?? 0,
      thumbnailUrl: course.thumbnailUrl,
      // Add other required fields
    } as any;
    add(cartCourse);
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
      className="fixed z-[9999] w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden pointer-events-auto transition-all duration-200 ease-out"
      style={{
        top: position?.top ? `${position.top}px` : 'auto',
        left: position?.left ? `${position.left}px` : 'auto',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
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
        // Small delay before closing
        closeTimeoutRef.current = setTimeout(() => {
          onClose?.();
        }, 150);
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 mb-2">
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
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Thêm vào giỏ hàng</span>
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-2.5 rounded-lg border transition-colors ${
              isWishlisted
                ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

