import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  Play, 
  FileText, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';
import type { RecentActivity } from '../../services/student';

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export default function RecentActivityList({ activities }: RecentActivityListProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return BookOpen;
      case 'completion':
        return Trophy;
      case 'lesson_completed':
        return CheckCircle;
      case 'quiz_taken':
        return FileText;
      default:
        return Play;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'completion':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'lesson_completed':
        return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20';
      case 'quiz_taken':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'Đã đăng ký khóa học';
      case 'completion':
        return 'Đã hoàn thành khóa học';
      case 'lesson_completed':
        return 'Đã hoàn thành bài học';
      case 'quiz_taken':
        return 'Đã làm bài quiz';
      default:
        return 'Hoạt động mới';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    } else {
      return activityTime.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Chưa có hoạt động nào
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Bắt đầu học để xem hoạt động ở đây
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            const activityText = getActivityText(activity.type);

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activityText}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    {activity.courseId && (
                      <Link
                        to={`/course/${activity.courseId}`}
                        className="ml-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-sm font-medium"
                      >
                        Xem
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
