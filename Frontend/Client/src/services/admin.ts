import api from './api';

export type AdminCourse = {
  courseId: number;
  title: string;
  shortDescription?: string;
  category?: string;
  slug?: string;
  thumbnailUrl?: string | null;
  price?: number | null;
  discountPrice?: number | null;
  currency?: string;
  averageRating?: number;
  ratingCount?: number;
  students?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  language?: string;
  level?: 'Beginner' | 'Intermediate' | 'Expert' | 'All' | string;
};

export type AdminCourseDetail = AdminCourse & {
  description?: string;
  effectivePrice?: number | null;
  hasDiscount?: boolean;
  lessons?: Array<{ lessonId: number; title: string; durationSec?: number; orderIndex?: number }>; 
};

export type Paginated<T> = {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export async function adminListCourses(params: { page?: number; pageSize?: number; search?: string; isPublished?: boolean | null } = {}) {
  const { page = 1, pageSize = 20, search, isPublished } = params;
  const res = await api.get('/api/Admin/courses', { params: { page, pageSize, search, isPublished } });
  return (res.data?.data ?? res.data) as Paginated<AdminCourse> | AdminCourse[];
}

export async function adminApproveCourse(courseId: number) {
  const res = await api.post(`/api/Admin/courses/${courseId}/approve`);
  return res.data?.data ?? res.data;
}

export async function adminRejectCourse(courseId: number) {
  const res = await api.post(`/api/Admin/courses/${courseId}/reject`);
  return res.data?.data ?? res.data;
}

export async function adminCreateCourse(payload: Partial<AdminCourse> & { title: string }) {
  const res = await api.post('/api/Admin/courses', payload);
  return res.data?.data ?? res.data;
}

export async function adminUpdateCourse(courseId: number, payload: Partial<AdminCourse>) {
  const res = await api.put(`/api/Admin/courses/${courseId}`, payload);
  return res.data?.data ?? res.data;
}

export async function adminDeleteCourse(courseId: number) {
  const res = await api.delete(`/api/Admin/courses/${courseId}`);
  return res.data?.data ?? res.data;
}

export async function adminGetCourseDetail(courseId: number) {
  // Use backend course detail endpoint (with /api prefix)
  const res = await api.get(`/api/courses/${courseId}`);
  return res.data?.data ?? res.data as AdminCourseDetail;
}

export type AdminCategory = {
  id: number;
  name: string;
  slug?: string;
  isActive?: boolean;
  displayOrder?: number;
  parentId?: number | null;
};

export async function adminGetCategories(opts: { includeInactive?: boolean; parentId?: number | null; hierarchical?: boolean } = {}) {
  const { includeInactive = true, parentId = null, hierarchical = false } = opts;
  const res = await api.get('/api/categories', { params: { includeInactive, parentId, hierarchical } });
  return res.data?.data ?? res.data;
}

export async function adminCreateCategory(payload: { name: string; slug?: string; parentId?: number | null }) {
  const res = await api.post('/api/Categories', payload);
  return res.data?.data ?? res.data;
}

export async function adminUpdateCategory(id: number, payload: { name?: string; slug?: string; parentId?: number | null; isActive?: boolean }) {
  const res = await api.put(`/api/Categories/${id}`, payload);
  return res.data?.data ?? res.data;
}

export async function adminDeleteCategory(id: number) {
  const res = await api.delete(`/api/Categories/${id}`);
  return res.data?.data ?? res.data;
}


