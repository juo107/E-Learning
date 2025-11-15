import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Trophy, 
  Calendar,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';
// TODO: Uncomment when API endpoints are ready
// import { getMyEnrollments, getStudentStats, getLearningActivities, getRecentActivities, getLearningStreak } from '../services/student';
import type { EnrollmentDto, StudentStats, LearningActivity, RecentActivity } from '../services/student';
import {
  CourseProgressCard,
  LearningHeatmap,
  StatisticsCards,
  RecentActivityList,
  LearningStreak
} from '../components/student';

export default function StudentDashboard() {
  const { t } = useTranslation();
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API calls when endpoints are ready
      // Temporary hardcoded data for development
      const mockEnrollments: EnrollmentDto[] = [
        {
          enrollmentId: 1,
          userId: 1,
          courseId: 1,
          progress: 65,
          enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          course: {
            courseId: 1,
            title: 'Introduction to Web Development',
            description: 'Learn the fundamentals of web development',
            categoryId: 1,
            level: 'Beginner',
            teacherName: 'John Doe',
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          enrollmentId: 2,
          userId: 1,
          courseId: 2,
          progress: 100,
          enrolledAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          course: {
            courseId: 2,
            title: 'Advanced JavaScript',
            description: 'Master advanced JavaScript concepts',
            categoryId: 1,
            level: 'Advanced',
            teacherName: 'Jane Smith',
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          enrollmentId: 3,
          userId: 1,
          courseId: 3,
          progress: 30,
          enrolledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          course: {
            courseId: 3,
            title: 'React Fundamentals',
            description: 'Build modern web applications with React',
            categoryId: 1,
            level: 'Intermediate',
            teacherName: 'Mike Johnson',
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ];

      const mockStats: StudentStats = {
        totalEnrollments: 3,
        completedCourses: 1,
        inProgressCourses: 2,
        totalStudyTime: 1250, // minutes
        currentStreak: 7,
        longestStreak: 15,
        averageScore: 85.5
      };

      // Generate mock activities for the last 3 months
      const mockActivities: LearningActivity[] = [];
      const today = new Date();
      for (let i = 90; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        if (Math.random() > 0.3) { // 70% chance of activity
          mockActivities.push({
            date: date.toISOString().split('T')[0],
            studyTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
            coursesStudied: Math.floor(Math.random() * 3) + 1,
            lessonsCompleted: Math.floor(Math.random() * 5) + 1
          });
        }
      }

      const mockRecentActivities: RecentActivity[] = [
        {
          id: 1,
          type: 'lesson_completed',
          title: 'Completed: React Hooks',
          description: 'Finished lesson on React Hooks in React Fundamentals',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          courseId: 3
        },
        {
          id: 2,
          type: 'quiz_taken',
          title: 'Quiz Completed',
          description: 'Scored 90% on JavaScript Quiz',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          courseId: 1
        },
        {
          id: 3,
          type: 'enrollment',
          title: 'Enrolled in React Fundamentals',
          description: 'Started learning React Fundamentals',
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          courseId: 3
        },
        {
          id: 4,
          type: 'completion',
          title: 'Course Completed',
          description: 'Completed Advanced JavaScript course',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          courseId: 2
        },
        {
          id: 5,
          type: 'lesson_completed',
          title: 'Completed: ES6 Features',
          description: 'Finished lesson on ES6 Features',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          courseId: 1
        }
      ];

      const mockStreak = {
        current: 7,
        longest: 15
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setEnrollments(mockEnrollments);
      setStats(mockStats);
      setActivities(mockActivities);
      setRecentActivities(mockRecentActivities);
      setStreak(mockStreak);
    } catch (err: any) {
      setError(t('common.somethingWentWrong') + '. ' + t('common.pleaseTryAgain'));
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {t('common.retry')}
            </button>
        </div>
      </div>
    );
  }

  const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100);
  const completedCourses = enrollments.filter(e => e.progress === 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.title')}
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t('dashboard.newCourse')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stats && <StatisticsCards stats={stats} />}

        {/* Learning Streak */}
        {streak && <LearningStreak current={streak.current} longest={streak.longest} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Course Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* In Progress Courses */}
            {inProgressCourses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-indigo-600" />
                    {t('dashboard.inProgress')}
                  </h2>
                  <Link 
                    to="/courses?filter=my-courses"
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {t('common.viewAll')}
                  </Link>
                </div>
                <div className="space-y-4">
                  {inProgressCourses.slice(0, 3).map((enrollment) => (
                    <CourseProgressCard key={enrollment.enrollmentId} enrollment={enrollment} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-green-600" />
                    {t('dashboard.completed')}
                  </h2>
                  <Link 
                    to="/courses?filter=completed"
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {t('common.viewAll')}
                  </Link>
                </div>
                <div className="space-y-4">
                  {completedCourses.slice(0, 3).map((enrollment) => (
                    <CourseProgressCard key={enrollment.enrollmentId} enrollment={enrollment} />
                  ))}
                </div>
              </div>
            )}

            {/* Learning Heatmap */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                {t('dashboard.learningHistory')}
              </h2>
              <LearningHeatmap activities={activities} />
            </div>
          </div>

          {/* Right Column - Activities & Stats */}
          <div className="space-y-8">
            {/* Recent Activities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                {t('dashboard.recentActivity')}
              </h2>
              <RecentActivityList activities={recentActivities} />
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                {t('dashboard.quickStats')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.totalCourses')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{enrollments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.inProgress')}</span>
                  <span className="font-semibold text-indigo-600">{inProgressCourses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.completed')}</span>
                  <span className="font-semibold text-green-600">{completedCourses.length}</span>
                </div>
                {stats && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.studyTime')}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {Math.round(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.averageScore')}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{stats.averageScore.toFixed(1)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
