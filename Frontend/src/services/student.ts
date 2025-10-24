import api from './api';

export interface EnrollmentDto {
  enrollmentId: number;
  userId: number;
  courseId: number;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  course: {
    courseId: number;
    title: string;
    description: string;
    categoryId: number;
    level: string;
    teacherName?: string;
    createdAt: string;
  };
}

export interface StudentStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  totalStudyTime: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
}

export interface LearningActivity {
  date: string;
  studyTime: number; // in minutes
  coursesStudied: number;
  lessonsCompleted: number;
}

export interface RecentActivity {
  id: number;
  type: 'enrollment' | 'completion' | 'lesson_completed' | 'quiz_taken';
  title: string;
  description: string;
  timestamp: string;
  courseId?: number;
}

// Get user enrollments
export async function getMyEnrollments(): Promise<EnrollmentDto[]> {
  const response = await api.get('/api/Courses/my-enrollments');
  return response.data;
}

// Update course progress
export async function updateCourseProgress(courseId: number, progress: number): Promise<void> {
  await api.put(`/api/Courses/${courseId}/progress`, progress);
}

// Get student statistics
export async function getStudentStats(): Promise<StudentStats> {
  const response = await api.get('/api/Student/stats');
  return response.data;
}

// Get learning activities for heatmap
export async function getLearningActivities(year?: number): Promise<LearningActivity[]> {
  const response = await api.get(`/api/Student/activities${year ? `?year=${year}` : ''}`);
  return response.data;
}

// Get recent activities
export async function getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
  const response = await api.get(`/api/Student/recent-activities?limit=${limit}`);
  return response.data;
}

// Get learning streak
export async function getLearningStreak(): Promise<{ current: number; longest: number }> {
  const response = await api.get('/api/Student/streak');
  return response.data;
}
