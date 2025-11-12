import api from './api';

export type InstructorDto = {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  bio: string;
  profession: string;
  rating: number;
  totalCourses: number;
  totalStudents: number;
  totalReviews: number;
};

/**
 * Lấy thông tin giảng viên theo ID
 */
export async function getInstructorById(id: number): Promise<InstructorDto> {
  try {
    const res = await api.get(`/api/instructor/${id}`);
    return res.data?.data ?? res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get instructor');
  }
}

/**
 * Lấy thông tin giảng viên theo UserId
 */
export async function getInstructorByUserId(userId: string): Promise<InstructorDto> {
  try {
    const res = await api.get(`/api/instructor/user/${userId}`);
    return res.data?.data ?? res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get instructor');
  }
}

/**
 * Lấy danh sách khóa học của giảng viên
 */
export async function getInstructorCourses(instructorId: number): Promise<any[]> {
  try {
    const res = await api.get(`/api/instructor/${instructorId}/courses`);
    return res.data?.data ?? res.data ?? [];
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get instructor courses');
  }
}

