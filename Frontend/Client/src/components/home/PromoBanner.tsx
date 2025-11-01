import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCourses, type CourseCardDto } from '../../services/courses';
import { ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  const [featuredCourse, setFeaturedCourse] = useState<CourseCardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadFeaturedCourse = async () => {
      try {
        setLoading(true);
        // Chỉ fetch 1 khóa học với sort ngẫu nhiên hoặc rating cao nhất
        // Nếu muốn chọn ngẫu nhiên, fetch 3 khóa học và chọn 1
        const response = await fetchCourses(1, 3);
        const courses = (response as any).data ?? [];
        
        if (cancelled) return;

        // Chọn khóa học ngẫu nhiên từ 3 khóa học đã fetch
        let selectedCourse: CourseCardDto | null = null;
        
        if (courses.length > 0) {
          // Chọn ngẫu nhiên từ danh sách đã fetch (chỉ 3 khóa học)
          selectedCourse = courses[Math.floor(Math.random() * courses.length)];
        }

        setFeaturedCourse(selectedCourse);
      } catch (error) {
        console.error('Failed to load featured course:', error);
        if (!cancelled) setFeaturedCourse(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadFeaturedCourse();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="w-full px-4 py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="loading-spinner" aria-label="Loading" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredCourse) {
    return null;
  }

  // Lấy tiêu đề và mô tả từ khóa học
  // Nếu khóa học có title quá dài, có thể rút ngắn
  const courseTitle = featuredCourse.title || 'Khóa học nổi bật';
  const courseDescription = featuredCourse.shortDescription 
    ? featuredCourse.shortDescription.length > 120 
      ? featuredCourse.shortDescription.substring(0, 120) + '...'
      : featuredCourse.shortDescription
    : 'Xây dựng thói quen AI cho bạn và đội nhóm của bạn để có được các kỹ năng thực hành giúp bạn lãnh đạo hiệu quả.';

  // Ảnh thumbnail chính của khóa học
  const courseImage = featuredCourse.thumbnailUrl || featuredCourse.primaryImageUrl || `https://picsum.photos/seed/${featuredCourse.courseId}/800/600`;

  return (
    <section className="w-full px-4 py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content - Left Side */}
          <div className="flex-1 lg:max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {courseTitle}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {courseDescription}
            </p>
            <div>
              <Link
                to={`/course/${featuredCourse.courseId}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all hover:shadow-md"
              >
                Bắt đầu học
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Course Image - Right Side */}
          <div className="flex-1 relative w-full max-w-2xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={courseImage}
                alt={courseTitle}
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

