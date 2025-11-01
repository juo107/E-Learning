import { BookOpen, Trophy, Clock, TrendingUp, Award, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { StudentStats } from '../../services/student';

interface StatisticsCardsProps {
  stats: StudentStats;
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  const { t } = useTranslation();
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}${t('time.hours')} ${remainingMinutes}${t('time.minutes')}`;
    }
    return `${remainingMinutes}${t('time.minutes')}`;
  };

  const cards = [
    {
      title: t('dashboard.totalCourses'),
      value: stats.totalEnrollments,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: t('courses.enrolled')
    },
    {
      title: t('dashboard.completed'),
      value: stats.completedCourses,
      icon: Trophy,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: t('courses.title')
    },
    {
      title: t('dashboard.inProgress'),
      value: stats.inProgressCourses,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: t('courses.title')
    },
    {
      title: t('dashboard.studyTime'),
      value: formatTime(stats.totalStudyTime),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: t('dashboard.totalTime')
    },
    {
      title: t('dashboard.learningStreak'),
      value: stats.currentStreak,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: t('time.days')
    },
    {
      title: t('dashboard.averageScore'),
      value: stats.averageScore.toFixed(1),
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      description: t('dashboard.totalCourses')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {card.description}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
