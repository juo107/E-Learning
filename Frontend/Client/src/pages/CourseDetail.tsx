import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCourseById, type CourseDetailDto } from '../services/courses';
import { addToCart, getCartItems, type CartItemDto } from '../services/cart';
import { getInstructorCourses } from '../services/instructor';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../store/useCart';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

function SectionAccordion({ sec, index }: { sec: any; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [maxH, setMaxH] = useState<string>(open ? '1000px' : '0px');

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (open) {
      const h = el.scrollHeight;
      setMaxH(h + 'px');
    } else {
      setMaxH('0px');
    }
  }, [open, sec]);

  const totalMin = (sec.items || []).reduce((sum: number, it: any) => sum + Math.round((it.durationSec||0)/60), 0);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-white/70 dark:bg-gray-900/70 hover:bg-white/90 dark:hover:bg-gray-900/90 transition-colors"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={`sec-panel-${index}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"/>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {index+1}. {sec.title}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{(sec.items||[]).length} bài • ~{totalMin} phút</span>
          <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
        </div>
      </button>
      <div
        id={`sec-panel-${index}`}
        ref={panelRef}
        style={{ maxHeight: maxH }}
        className="overflow-hidden transition-[max-height] duration-500 ease-out bg-white/40 dark:bg-gray-900/40"
      >
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {(sec.items || []).map((ls: any) => (
            <li key={ls.lessonId} className="flex items-center justify-between px-6 py-2">
              <span className="flex items-center gap-3">
                <span className="text-gray-500">{ls.orderIndex}.</span>
                <span className="text-gray-800 dark:text-gray-200">{ls.title}</span>
              </span>
              <span className="text-sm text-gray-500">{Math.round((ls.durationSec||0)/60)} min</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items } = useCart();
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [instructorCourses, setInstructorCourses] = useState<any[]>([]);

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
      .then((c) => { 
        if (!cancelled) {
          console.log('Course data received:', c);
          console.log('Instructor data:', c.instructor);
          setCourse(c); 
        }
      })
      .catch((e) => { if (!cancelled) setError(e?.message ?? 'Failed to load'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

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

  // Load instructor courses when course is loaded
  useEffect(() => {
    const loadInstructorCourses = async () => {
      if (!course?.instructor?.id) return;
      
      // Validate instructor ID is a valid number
      const instructorId = typeof course.instructor.id === 'number' 
        ? course.instructor.id 
        : parseInt(course.instructor.id, 10);
      
      if (isNaN(instructorId) || instructorId <= 0) {
        console.warn('Invalid instructor ID:', course.instructor.id);
        return;
      }
      
      try {
        const courses = await getInstructorCourses(instructorId);
        // Filter out current course
        setInstructorCourses(courses.filter((c: any) => c.id !== course.courseId));
      } catch (err) {
        console.error('Failed to load instructor courses:', err);
      }
    };
    loadInstructorCourses();
  }, [course?.instructor?.id, course?.courseId]);

  const handleAddToCart = async () => {
    if (!course) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${id}` } });
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
    setCartError(null);
    
    try {
      await addToCart(course.courseId.toString());
      // Reload cart items
      const updatedItems = await getCartItems();
      setCartItems(updatedItems);
      
      toast.success('Đã thêm vào giỏ hàng!', {
        icon: '🛒',
        duration: 3000,
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Không thể thêm vào giỏ hàng';
      setCartError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!course) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${id}` } });
      return;
    }

    // Redirect đến trang checkout với course ID
    navigate('/checkout', {
      state: {
        courseIds: [course.courseId.toString()],
      },
    });
  };

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
          {/** Non-typed optional fields from backend or future expansion */}
          {(() => { const anyCourse = course as any; return (
          <>
          {/* Explore related topics */}
          {Array.isArray(anyCourse?.relatedTopics) && anyCourse.relatedTopics.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Khám phá các chủ đề liên quan</h2>
              <div className="flex flex-wrap gap-2">
                {anyCourse.relatedTopics.map((t: string) => (
                  <Link key={t} to={`/courses?topic=${encodeURIComponent(t)}`} className="text-xs px-3 py-1 rounded-full border border-gray-300/70 dark:border-gray-800/70 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          )}
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

          {/* Curriculum (Sections with dropdown) */}
          {(() => { const anyCourse = course as any; return (
            (Array.isArray(anyCourse?.curriculum) && anyCourse.curriculum.length > 0) ? (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Nội dung khóa học</h2>
                <div className="rounded-xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden">
                  {anyCourse.curriculum.map((sec: any, idx: number) => (
                    <SectionAccordion key={sec.sectionId || idx} sec={sec} index={idx} />
                  ))}
                </div>
              </div>
            ) : (
              course.lessons && course.lessons.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">Nội dung khóa học</h2>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-800/60">
                    {course.lessons.map(ls => (
                      <li key={ls.lessonId} className="flex items-center justify-between px-4 py-2">
                        <span>{ls.orderIndex}. {ls.title}</span>
                        <span className="text-sm text-gray-500">{Math.round(ls.durationSec/60)} min</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )
          )})()}

          {/* Requirements */}
          {(Array.isArray(anyCourse?.requirements) && anyCourse.requirements.length > 0) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Yêu cầu</h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                {anyCourse.requirements.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ratings & Reviews */}
          {course.reviews && course.reviews.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Xếp hạng, đánh giá</h2>
              <div className="mb-3 flex items-center gap-3">
                <div className="text-2xl font-bold">{course.averageRating.toFixed(1)} ★</div>
                <div className="text-sm text-gray-500">{course.ratingCount} đánh giá</div>
              </div>
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

          {/* Instructor */}
          {course?.instructor && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Giảng viên</h2>
              {(() => {
                // Handle both backend format and mock format
                const instructor = course.instructor as any;
                
                // Get instructor name - support both formats
                const instructorName = instructor.fullName 
                  || instructor.name 
                  || instructor.email?.split('@')[0] 
                  || 'Giảng viên';
                
                // Get profession/title
                const profession = instructor.profession || instructor.title || '';
                
                // Get bio
                const bio = instructor.bio || '';
                
                // Try to get valid instructor ID (number)
                let instructorId: number | null = null;
                if (typeof instructor.id === 'number') {
                  instructorId = instructor.id;
                } else if (typeof instructor.id === 'string') {
                  // Try to parse if it's a string number
                  const parsed = parseInt(instructor.id, 10);
                  if (!isNaN(parsed) && parsed > 0) {
                    instructorId = parsed;
                  }
                }
                
                const isValidId = instructorId !== null && instructorId > 0;
                const containerClass = "rounded-xl border border-gray-200/60 dark:border-gray-800/60 p-4 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors";
                
                const content = (
                  <div className="flex items-start gap-4">
                    <img 
                      src={instructor.avatarUrl || `https://i.pravatar.cc/96?u=${instructor.userId || instructor.email || instructorName}`} 
                      alt={instructorName} 
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {instructorName}
                      </div>
                      {profession && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {profession}
                        </div>
                      )}
                      {instructor.rating > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{instructor.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({instructor.totalReviews || 0} đánh giá)
                          </span>
                        </div>
                      )}
                      {bio && (
                        <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                          {bio}
                        </p>
                      )}
                      {(instructor.totalCourses > 0 || instructor.totalStudents > 0) && (
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                          {instructor.totalCourses > 0 && <span>{instructor.totalCourses} khóa học</span>}
                          {instructor.totalCourses > 0 && instructor.totalStudents > 0 && <span>•</span>}
                          {instructor.totalStudents > 0 && (
                            <span>{instructor.totalStudents.toLocaleString('vi-VN')} học viên</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
                
                if (isValidId && instructorId !== null) {
                  return (
                    <Link 
                      to={`/instructor/${instructorId}`}
                      className={`block ${containerClass} cursor-pointer`}
                    >
                      {content}
                    </Link>
                  );
                }
                
                return (
                  <div className={containerClass}>
                    {content}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Other courses by instructor */}
          {instructorCourses.length > 0 && course?.instructor && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">
                Các khóa học khác của {course.instructor.fullName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {instructorCourses.slice(0, 4).map((c: any) => (
                  <Link 
                    to={`/course/${c.id}`} 
                    key={c.id} 
                    className="rounded-xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden hover:border-indigo-400 transition-colors"
                  >
                    <img 
                      src={c.thumbnailUrl || `https://picsum.photos/seed/oc-${c.id}/600/338`} 
                      alt={c.title} 
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3">
                      <div className="line-clamp-2 font-medium text-gray-900 dark:text-white">{c.title}</div>
                      <div className="mt-1 text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(c.finalPrice ?? c.price ?? 0)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          </>
          )})()}
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
            {cartError && (
              <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded">
                {cartError}
              </div>
            )}
            <button 
              onClick={handleBuyNow}
              disabled={addingToCart}
              className="mt-3 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white py-2.5 font-semibold shadow hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {course.effectivePrice === 0 ? 'Đăng ký miễn phí' : 'Mua ngay'}
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-800 py-2 text-sm hover:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>
            <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Truy cập trên điện thoại & TV</li>
              <li>• Chứng chỉ hoàn thành</li>
              <li>• 7 ngày hoàn tiền</li>
            </ul>
          </div>
          {/* Students also bought */}
          {(() => { const anyCourse = course as any; return (Array.isArray(anyCourse?.studentsAlsoBought) && anyCourse.studentsAlsoBought.length > 0) })() && (
            <div className="mt-4 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 p-4">
              <div className="font-semibold mb-2">Học viên cũng mua</div>
              <ul className="space-y-3">
                {(course as any).studentsAlsoBought.slice(0,5).map((c: any) => (
                  <li key={c.courseId}>
                    <Link to={`/course/${c.courseId}`} className="flex items-center gap-3 group">
                      <img src={c.thumbnailUrl || `https://picsum.photos/seed/ab-${c.courseId}/96/54`} alt={c.title} className="w-16 h-10 object-cover rounded"/>
                      <div className="min-w-0">
                        <div className="text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">{c.title}</div>
                        <div className="text-xs text-gray-500">{c.averageRating?.toFixed?.(1) ?? 'N/A'} ★</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}



