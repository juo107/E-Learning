import React, { useState, useMemo } from 'react';
import { Calendar, Clock, BookOpen, Target, TrendingUp, Award } from 'lucide-react';

interface LearningActivity {
  date: string;
  studyTime: number; // minutes
  coursesCompleted: number;
  lessonsWatched: number;
  quizzesPassed: number;
  streak: number;
}

interface HeatmapProps {
  data?: LearningActivity[];
  year?: number;
  onDateClick?: (date: string, activity: LearningActivity) => void;
}

const LearningHeatmap: React.FC<HeatmapProps> = ({ 
  data = [], 
  year = new Date().getFullYear(),
  onDateClick 
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Generate mock data if no data provided
  const mockData = useMemo(() => {
    if (data.length > 0) return data;
    
    const activities: LearningActivity[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const random = Math.random();
      
      if (random > 0.3) { // 70% chance of activity
        activities.push({
          date: dateStr,
          studyTime: Math.floor(Math.random() * 240) + 30, // 30-270 minutes
          coursesCompleted: Math.random() > 0.8 ? 1 : 0,
          lessonsWatched: Math.floor(Math.random() * 5) + 1,
          quizzesPassed: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
          streak: Math.floor(Math.random() * 10) + 1
        });
      }
    }
    
    return activities;
  }, [data, year]);

  // Calculate heatmap data
  const heatmapData = useMemo(() => {
    const maxStudyTime = Math.max(...mockData.map(d => d.studyTime), 1);
    const weeks: { [key: string]: LearningActivity[] } = {};
    
    mockData.forEach(activity => {
      const date = new Date(activity.date);
      const weekKey = viewMode === 'week' 
        ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push(activity);
    });
    
    return { weeks, maxStudyTime };
  }, [mockData, viewMode]);

  // Get intensity level for color
  const getIntensity = (activity: LearningActivity, maxTime: number) => {
    const intensity = activity.studyTime / maxTime;
    if (intensity === 0) return 0;
    if (intensity < 0.2) return 1;
    if (intensity < 0.4) return 2;
    if (intensity < 0.6) return 3;
    if (intensity < 0.8) return 4;
    return 5;
  };

  // Get color class based on intensity
  const getColorClass = (intensity: number) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800', // 0 - no activity
      'bg-green-100 dark:bg-green-900/30', // 1 - low
      'bg-green-200 dark:bg-green-800/40', // 2 - low-medium
      'bg-green-300 dark:bg-green-700/50', // 3 - medium
      'bg-green-400 dark:bg-green-600/60', // 4 - medium-high
      'bg-green-500 dark:bg-green-500/70'  // 5 - high
    ];
    return colors[intensity] || colors[0];
  };

  // Format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Get week days for header
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudyTime = mockData.reduce((sum, activity) => sum + activity.studyTime, 0);
    const totalCourses = mockData.reduce((sum, activity) => sum + activity.coursesCompleted, 0);
    const totalLessons = mockData.reduce((sum, activity) => sum + activity.lessonsWatched, 0);
    const totalQuizzes = mockData.reduce((sum, activity) => sum + activity.quizzesPassed, 0);
    const currentStreak = Math.max(...mockData.map(d => d.streak), 0);
    const activeDays = mockData.length;
    
    return {
      totalStudyTime,
      totalCourses,
      totalLessons,
      totalQuizzes,
      currentStreak,
      activeDays
    };
  }, [mockData]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Learning Activity Heatmap
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track your learning progress throughout {year}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'month'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Month View
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {formatTime(stats.totalStudyTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {stats.totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lessons</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {stats.totalLessons}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes</p>
                <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  {stats.totalQuizzes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">
                  {stats.currentStreak} days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Days</p>
                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                  {stats.activeDays}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {viewMode === 'week' ? 'Weekly Activity' : 'Monthly Activity'}
          </h3>
          
          {/* Legend */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {viewMode === 'week' ? (
              <div className="grid grid-cols-8 gap-1">
                {/* Week days header */}
                <div></div>
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Week rows */}
                {Object.entries(heatmapData.weeks).map(([weekKey, activities]) => (
                  <React.Fragment key={weekKey}>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2 flex items-center">
                      W{weekKey.split('-W')[1]}
                    </div>
                    {weekDays.map(day => {
                      const dayActivity = activities.find(activity => {
                        const date = new Date(activity.date);
                        return date.getDay() === (weekDays.indexOf(day) + 1) % 7;
                      });
                      
                      const intensity = dayActivity ? getIntensity(dayActivity, heatmapData.maxStudyTime) : 0;
                      
                      return (
                        <div
                          key={`${weekKey}-${day}`}
                          className={`w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 ${getColorClass(intensity)}`}
                          onClick={() => {
                            if (dayActivity) {
                              setSelectedDate(dayActivity.date);
                              onDateClick?.(dayActivity.date, dayActivity);
                            }
                          }}
                          title={dayActivity ? `${dayActivity.date}: ${formatTime(dayActivity.studyTime)}` : 'No activity'}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-13 gap-1">
                {/* Month header */}
                <div></div>
                {months.map(month => (
                  <div key={month} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                    {month}
                  </div>
                ))}
                
                {/* Month rows */}
                {Object.entries(heatmapData.weeks).map(([monthKey, activities]) => (
                  <React.Fragment key={monthKey}>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2 flex items-center">
                      {monthKey.split('-')[1]}
                    </div>
                    {months.map((_, monthIndex) => {
                      const monthActivities = activities.filter(activity => {
                        const date = new Date(activity.date);
                        return date.getMonth() === monthIndex;
                      });
                      
                      const totalTime = monthActivities.reduce((sum, activity) => sum + activity.studyTime, 0);
                      const intensity = totalTime > 0 ? getIntensity({ studyTime: totalTime } as LearningActivity, heatmapData.maxStudyTime) : 0;
                      
                      return (
                        <div
                          key={`${monthKey}-${monthIndex}`}
                          className={`w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 ${getColorClass(intensity)}`}
                          onClick={() => {
                            if (monthActivities.length > 0) {
                              const latestActivity = monthActivities[monthActivities.length - 1];
                              setSelectedDate(latestActivity.date);
                              onDateClick?.(latestActivity.date, latestActivity);
                            }
                          }}
                          title={monthActivities.length > 0 ? `${months[monthIndex]}: ${formatTime(totalTime)}` : 'No activity'}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Activity Details - {new Date(selectedDate).toLocaleDateString()}
          </h4>
          {(() => {
            const activity = mockData.find(a => a.date === selectedDate);
            if (!activity) return <p className="text-gray-600 dark:text-gray-400">No activity on this date</p>;
            
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatTime(activity.studyTime)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {activity.lessonsWatched}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {activity.quizzesPassed}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {activity.streak}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default LearningHeatmap;
