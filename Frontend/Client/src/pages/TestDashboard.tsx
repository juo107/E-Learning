import { useState, useEffect } from 'react';
import type { EnrollmentDto, StudentStats, LearningActivity, RecentActivity } from '../services/student';
import CourseProgressCard from '../components/student/CourseProgressCard';
import LearningHeatmap from '../components/student/LearningHeatmap';
import StatisticsCards from '../components/student/StatisticsCards';
import RecentActivityList from '../components/student/RecentActivityList';
import LearningStreak from '../components/student/LearningStreak';

// Mock data for testing
const mockEnrollments: EnrollmentDto[] = [
  {
    enrollmentId: 1,
    userId: 1,
    courseId: 1,
    progress: 75,
    enrolledAt: '2024-01-15T10:00:00Z',
    course: {
      courseId: 1,
      title: 'React Advanced Patterns',
      description: 'Học các pattern nâng cao trong React như HOC, Render Props, và Custom Hooks',
      categoryId: 1,
      level: 'Advanced',
      teacherName: 'Nguyễn Văn A',
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  {
    enrollmentId: 2,
    userId: 1,
    courseId: 2,
    progress: 100,
    enrolledAt: '2024-01-10T10:00:00Z',
    completedAt: '2024-02-15T10:00:00Z',
    course: {
      courseId: 2,
      title: 'JavaScript Fundamentals',
      description: 'Khóa học cơ bản về JavaScript từ A-Z',
      categoryId: 1,
      level: 'Beginner',
      teacherName: 'Trần Thị B',
      createdAt: '2024-01-01T00:00:00Z'
    }
  }
];

const mockStats: StudentStats = {
  totalEnrollments: 5,
  completedCourses: 2,
  inProgressCourses: 3,
  totalStudyTime: 1250, // 20 hours 50 minutes
  currentStreak: 7,
  longestStreak: 15,
  averageScore: 87.5
};

const mockActivities: LearningActivity[] = [
  { date: '2024-01-15', studyTime: 120, coursesStudied: 1, lessonsCompleted: 3 },
  { date: '2024-01-16', studyTime: 90, coursesStudied: 1, lessonsCompleted: 2 },
  { date: '2024-01-17', studyTime: 150, coursesStudied: 2, lessonsCompleted: 4 },
  { date: '2024-01-18', studyTime: 0, coursesStudied: 0, lessonsCompleted: 0 },
  { date: '2024-01-19', studyTime: 180, coursesStudied: 1, lessonsCompleted: 5 },
  { date: '2024-01-20', studyTime: 60, coursesStudied: 1, lessonsCompleted: 1 },
  { date: '2024-01-21', studyTime: 240, coursesStudied: 2, lessonsCompleted: 6 }
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: 1,
    type: 'lesson_completed',
    title: 'Hoàn thành bài học: React Hooks',
    description: 'Bạn đã hoàn thành bài học về React Hooks',
    timestamp: '2024-01-21T14:30:00Z',
    courseId: 1
  },
  {
    id: 2,
    type: 'completion',
    title: 'Hoàn thành khóa học JavaScript',
    description: 'Chúc mừng! Bạn đã hoàn thành khóa học JavaScript Fundamentals',
    timestamp: '2024-01-20T16:45:00Z',
    courseId: 2
  },
  {
    id: 3,
    type: 'enrollment',
    title: 'Đăng ký khóa học mới',
    description: 'Bạn đã đăng ký khóa học React Advanced Patterns',
    timestamp: '2024-01-19T09:15:00Z',
    courseId: 1
  }
];

export default function TestDashboard() {
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>(mockEnrollments);
  const [stats, setStats] = useState<StudentStats>(mockStats);
  const [activities, setActivities] = useState<LearningActivity[]>(mockActivities);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(mockRecentActivities);
  const [streak, setStreak] = useState<{ current: number; longest: number }>({ current: 7, longest: 15 });

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
                Test Dashboard - Học Tập
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Trang test các component dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <StatisticsCards stats={stats} />

        {/* Learning Streak */}
        <div className="mt-8">
          <LearningStreak current={streak.current} longest={streak.longest} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Course Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* In Progress Courses */}
            {inProgressCourses.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Khóa học đang học
                </h2>
                <div className="space-y-4">
                  {inProgressCourses.map((enrollment) => (
                    <CourseProgressCard key={enrollment.enrollmentId} enrollment={enrollment} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Khóa học đã hoàn thành
                </h2>
                <div className="space-y-4">
                  {completedCourses.map((enrollment) => (
                    <CourseProgressCard key={enrollment.enrollmentId} enrollment={enrollment} />
                  ))}
                </div>
              </div>
            )}

            {/* Learning Heatmap */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Lịch sử học tập
              </h2>
              <LearningHeatmap activities={activities} />
            </div>
          </div>

          {/* Right Column - Activities & Stats */}
          <div className="space-y-8">
            {/* Recent Activities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Hoạt động gần đây
              </h2>
              <RecentActivityList activities={recentActivities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




