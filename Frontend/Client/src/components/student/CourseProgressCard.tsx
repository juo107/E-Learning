import { Link } from 'react-router-dom';
import { Clock, User, Award, Play } from 'lucide-react';
import type { EnrollmentDto } from '../../services/student';

interface CourseProgressCardProps {
  enrollment: EnrollmentDto;
}

export default function CourseProgressCard({ enrollment }: CourseProgressCardProps) {
  const { course, progress, enrolledAt, completedAt } = enrollment;
  const isCompleted = progress === 100;
  const progressColor = isCompleted ? 'bg-green-500' : 'bg-indigo-500';
  const statusColor = isCompleted ? 'text-green-600' : 'text-indigo-600';
  const statusText = isCompleted ? 'Hoàn thành' : 'Đang học';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getProgressText = () => {
    if (isCompleted) {
      return `Hoàn thành ngày ${completedAt ? formatDate(completedAt) : 'N/A'}`;
    }
    return `Tiến độ: ${progress.toFixed(1)}%`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link 
            to={`/course/${course.courseId}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {course.title}
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {course.description}
          </p>
        </div>
        <div className="ml-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} bg-opacity-10`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Course Info */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        {course.teacherName && (
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{course.teacherName}</span>
          </div>
        )}
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>Đăng ký: {formatDate(enrolledAt)}</span>
        </div>
        <div className="flex items-center">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            {course.level}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getProgressText()}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <Link
          to={`/course/${course.courseId}`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isCompleted ? (
            <>
              <Award className="w-4 h-4 mr-2" />
              Xem chứng chỉ
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Tiếp tục học
            </>
          )}
        </Link>
        
        {!isCompleted && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Còn lại: {Math.round(100 - progress)}%
          </div>
        )}
      </div>
    </div>
  );
}
