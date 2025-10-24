import { Heart, Star, Users, Eye } from 'lucide-react';
import type { Course } from '../../types/course';
import type { CourseCardDto } from '../../services/courses';

type Props = {
  course: Course | CourseCardDto;
  onAddToCart?: (course: Course | CourseCardDto) => void;
  onToggleWishlist?: (course: Course | CourseCardDto) => void;
};

export default function CourseCard({ course, onAddToCart, onToggleWishlist }: Props) {
  // Handle both old and new course formats
  const isNewFormat = 'courseId' in course;
  const courseId = isNewFormat ? course.courseId : (course as any).id;
  const title = course.title;
  const shortDescription = isNewFormat ? course.shortDescription : (course as any).subtitle;
  const price = isNewFormat ? course.price : (course as any).price?.current || 0;
  const discountPrice = isNewFormat ? course.discountPrice : (course as any).price?.former;
  const averageRating = isNewFormat ? course.averageRating : (course as any).rating || 0;
  const ratingCount = isNewFormat ? course.ratingCount : (course as any).totalRatings || 0;
  const enrollmentCount = isNewFormat ? course.enrollmentCount : (course as any).students || 0;
  const viewCount = isNewFormat ? course.viewCount : 0;
  const teacherName = isNewFormat ? course.teacherName : (course as any).instructors?.[0]?.name;
  const level = isNewFormat ? course.level : (course as any).level;
  const language = isNewFormat ? course.language : (course as any).language;
  const isFeatured = isNewFormat ? course.isFeatured : false;
  const thumbnailUrl = course.thumbnailUrl || (course as any).previewVideo?.poster;
  
  const discount = discountPrice ? Math.round(100 - (price / discountPrice) * 100) : undefined;
  const effectivePrice = discountPrice || price;

  return (
    <div className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-950 hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={thumbnailUrl || `https://picsum.photos/seed/course-${courseId}/800/450`} 
          alt={title} 
          loading="lazy" 
          className="aspect-video w-full object-cover" 
        />
        {isFeatured && (
          <span className="absolute left-2 top-2 rounded bg-amber-500 text-black text-xs font-semibold px-2 py-0.5">
            Featured
          </span>
        )}
        {(course as any).badges && (course as any).badges.length > 0 && (
          <span className="absolute right-2 top-2 rounded bg-amber-500 text-black text-xs font-semibold px-2 py-0.5">
            {(course as any).badges[0]}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold line-clamp-2 flex-1">{title}</h3>
          <button aria-label="Wishlist" onClick={() => onToggleWishlist?.(course)} className="text-gray-600 hover:text-pink-600">
            <Heart className="size-4" />
          </button>
        </div>
        {teacherName && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{teacherName}</p>
        )}
        <div className="mt-1 text-sm">
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
          <span className="ml-1 text-yellow-500">{'★'.repeat(Math.round(averageRating))}</span>
          <span className="ml-1 text-gray-500">({ratingCount.toLocaleString()})</span>
        </div>
        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
          {level && <span>{level}</span>}
          {language && <span>• {language}</span>}
          {enrollmentCount > 0 && (
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {enrollmentCount.toLocaleString()}
            </span>
          )}
          {viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {viewCount.toLocaleString()}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="text-lg font-bold">
            {effectivePrice.toLocaleString()} ₫
          </div>
          {discountPrice && (
            <div className="text-sm text-gray-500 line-through">
              {discountPrice.toLocaleString()} ₫
            </div>
          )}
          {discount && <span className="text-xs font-semibold text-rose-600">{discount}% off</span>}
        </div>
        <div className="mt-3">
          <button onClick={() => onAddToCart?.(course)} className="w-full rounded-md bg-indigo-600 text-white py-2 hover:bg-indigo-700">
            Add to cart
          </button>
        </div>
      </div>
      {/* Hover popover */}
      <div className="hidden md:block">
        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute z-10 w-80 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl translate-y-[-100%]">
            <div className="font-semibold mb-1 line-clamp-2">{shortDescription}</div>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>Hands-on projects</li>
              <li>Lifetime access</li>
              <li>Certificate of completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



