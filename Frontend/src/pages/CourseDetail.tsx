import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseById, type CourseDetailDto } from '../services/courses';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Course ID is required');
      setLoading(false);
      return;
    }

    // Backend uses GUID, so always use as string
    const courseId = id;

    let cancelled = false;
    setLoading(true); setError(null);
    fetchCourseById(courseId)
      .then((c) => { if (!cancelled) setCourse(c); })
      .catch((e) => { if (!cancelled) setError(e?.message ?? 'Failed to load'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return (
    <div className="p-10 flex items-center justify-center"><div className="loading-spinner" /></div>
  );
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!course) return null;

  return (
    <section className="w-full px-4 py-8">
      <Link to="/courses" className="text-indigo-600">← Back to courses</Link>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Media card */}
          <div className="relative rounded-2xl overflow-hidden h-60 md:h-80 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 shadow-sm">
            <img
              src={course.thumbnailUrl || `https://picsum.photos/seed/course-${course.courseId}/1200/675`}
              alt={course.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-white text-xs md:text-sm px-2 py-1 rounded bg-black/50 backdrop-blur">
                {course.categoryName || 'Course'}
              </span>
              <span className="text-white text-xs md:text-sm px-2 py-1 rounded bg-amber-500/90" title="Đánh giá trung bình">
                {course.averageRating.toFixed(1)} ★ ({course.ratingCount})
              </span>
            </div>
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{course.shortDescription}</p>
          {course.description && (
            <div className="mt-4 whitespace-pre-line text-gray-700 dark:text-gray-300">{course.description}</div>
          )}

          {/* Curriculum */}
          {course.lessons && course.lessons.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Curriculum</h2>
              <ul className="divide-y divide-gray-200 dark:divide-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-800/60">
                {course.lessons.map(ls => (
                  <li key={ls.lessonId} className="flex items-center justify-between px-4 py-2">
                    <span>{ls.orderIndex}. {ls.title}</span>
                    <span className="text-sm text-gray-500">{Math.round(ls.durationSec/60)} min</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews (top 3) */}
          {course.reviews && course.reviews.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Reviews</h2>
              <ul className="space-y-3">
                {course.reviews.slice(0,3).map(rv => (
                  <li key={rv.reviewId} className="rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-3">
                    <div className="font-medium">{rv.userName} <span className="ml-2 text-yellow-500">{'★'.repeat(rv.rating)}</span></div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{rv.comment}</div>
                  </li>
                ))}
              </ul>
              {course.reviews.length > 3 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-indigo-600">Xem thêm</summary>
                  <ul className="mt-2 space-y-3">
                    {course.reviews.slice(3).map(rv => (
                      <li key={rv.reviewId} className="rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-3">
                        <div className="font-medium">{rv.userName} <span className="ml-2 text-yellow-500">{'★'.repeat(rv.rating)}</span></div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{rv.comment}</div>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>
        <aside className="md:col-span-1 self-start sticky top-20">
          <div className="relative rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-950/90 shadow-sm p-4">
            {course.hasDiscount && course.discountPercent && (
              <span className="absolute -top-2 -right-2 rounded bg-red-500 text-white text-xs font-semibold px-2 py-1">
                -{course.discountPercent}%
              </span>
            )}
            <div className="text-2xl font-extrabold">
              {course.currency === 'VND' ? (
                course.effectivePrice === 0 ? 'Miễn phí' : (
                  <div className="flex items-center gap-2">
                    {course.hasDiscount && course.price !== course.effectivePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {course.price?.toLocaleString?.('vi-VN') ?? course.price} ₫
                      </span>
                    )}
                    <span className="text-indigo-600">
                      {course.effectivePrice?.toLocaleString?.('vi-VN') ?? course.effectivePrice} ₫
                    </span>
                  </div>
                )
              ) : course.effectivePrice}
            </div>
            <p className="mt-1 text-xs text-gray-500">Bao gồm truy cập trọn đời • Học mọi lúc</p>
            <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white py-2.5 font-semibold shadow hover:shadow-md transition-shadow">
              {course.effectivePrice === 0 ? 'Đăng ký miễn phí' : 'Đăng ký ngay'}
            </button>
            <button className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-800 py-2 text-sm hover:border-indigo-400 transition-colors">Thêm vào danh sách</button>
            <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Truy cập trên điện thoại & TV</li>
              <li>• Chứng chỉ hoàn thành</li>
              <li>• 7 ngày hoàn tiền</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}


