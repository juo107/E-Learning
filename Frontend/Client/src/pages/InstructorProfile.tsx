import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInstructorById, getInstructorCourses, type InstructorDto } from '../services/instructor';
import { Star, Users, BookOpen, Award, Mail } from 'lucide-react';

export default function InstructorProfile() {
  const { id } = useParams<{ id: string }>();
  const [instructor, setInstructor] = useState<InstructorDto | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Instructor ID is required');
      setLoading(false);
      return;
    }

    const instructorId = parseInt(id, 10);
    if (isNaN(instructorId)) {
      setError('Invalid instructor ID');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [instructorData, coursesData] = await Promise.all([
          getInstructorById(instructorId),
          getInstructorCourses(instructorId),
        ]);
        setInstructor(instructorData);
        setCourses(coursesData);
      } catch (err: any) {
        setError(err?.message || 'Failed to load instructor profile');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Instructor not found'}
            </h1>
            <Link
              to="/courses"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Browse all courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-800/60 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={instructor.avatarUrl || `https://i.pravatar.cc/150?u=${instructor.userId}`}
                alt={instructor.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {instructor.fullName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {instructor.profession}
              </p>
              
              {instructor.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{instructor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    ({instructor.totalReviews} đánh giá)
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{instructor.totalCourses ?? 0} khóa học</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{(instructor.totalStudents ?? 0).toLocaleString('vi-VN')} học viên</span>
                </div>
                {instructor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>{instructor.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {instructor.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Về giảng viên
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {instructor.bio}
              </p>
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Khóa học của {instructor.fullName}
          </h2>
          
          {courses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-800/60 p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Giảng viên này chưa có khóa học nào.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course.thumbnailUrl || `https://picsum.photos/seed/${course.id}/600/338`}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {course.hasDiscount && course.discountPercent && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        -{course.discountPercent}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {course.averageRating > 0 && (
                        <>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {course.averageRating.toFixed(1)} ({course.ratingCount})
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {course.hasDiscount ? (
                        <>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(course.finalPrice ?? course.price ?? 0)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(course.price ?? 0)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(course.price ?? 0)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

