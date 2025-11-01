import { Flame, Trophy, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LearningStreakProps {
  current: number;
  longest: number;
}

export default function LearningStreak({ current, longest }: LearningStreakProps) {
  const { t } = useTranslation();
  
  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-500';
    if (streak < 7) return 'text-orange-500';
    if (streak < 30) return 'text-yellow-500';
    if (streak < 100) return 'text-green-500';
    return 'text-purple-500';
  };

  const getStreakBgColor = (streak: number) => {
    if (streak === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (streak < 7) return 'bg-orange-50 dark:bg-orange-900/20';
    if (streak < 30) return 'bg-yellow-50 dark:bg-yellow-900/20';
    if (streak < 100) return 'bg-green-50 dark:bg-green-900/20';
    return 'bg-purple-50 dark:bg-purple-900/20';
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return t('dashboard.startStreak');
    if (streak < 7) return t('dashboard.maintainStreak');
    if (streak < 30) return t('dashboard.impressiveStreak');
    if (streak < 100) return t('dashboard.excellentStreak');
    return t('dashboard.legendaryStreak');
  };

  const getStreakIcon = (streak: number) => {
    if (streak === 0) return Target;
    if (streak < 30) return Flame;
    return Trophy;
  };

  const currentColor = getStreakColor(current);
  const currentBgColor = getStreakBgColor(current);
  const currentMessage = getStreakMessage(current);
  const CurrentIcon = getStreakIcon(current);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${currentBgColor}`}>
            <CurrentIcon className={`w-6 h-6 ${currentColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('dashboard.learningStreak')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentMessage}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-6">
            {/* Current Streak */}
            <div className="text-center">
              <div className={`text-2xl font-bold ${currentColor}`}>
                {current}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.currentStreak')}
              </div>
            </div>
            
            {/* Longest Streak */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {longest}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.longestStreak')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {current > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{t('dashboard.learningStreak')} {t('dashboard.progress')}</span>
            <span>{current} {t('time.days')}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${currentColor.replace('text-', 'bg-')}`}
              style={{ 
                width: `${Math.min((current / Math.max(longest, 30)) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Motivational message */}
      {current === 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('dashboard.studyGoal')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
