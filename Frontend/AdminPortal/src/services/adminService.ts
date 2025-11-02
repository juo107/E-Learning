import adminApi from './api';

export interface CourseDto {
  id: string;
  courseCode: string;
  title: string;
  description?: string;
  price: number;
  finalPrice: number;
  durationInMinutes: number;
  categoryId?: string;
  level?: string;
  language?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  totalCategories: number;
  totalUsers: number;
  recentCourses: CourseDto[];
  recentActivity: any[];
}

// Course APIs
export interface CourseDetailsDto extends CourseDto {
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  categoryName?: string;
  thumbnailUrl?: string;
  primaryImageUrl?: string;
  promoVideoUrl?: string;
  discountPercent?: number;
  discountExpiresAt?: string;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  price: number;
  durationInMinutes: number;
  categoryId?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'Vi' | 'En';
  isPublished: boolean;
  publishedAt?: string;
  discountPercent?: number;
  finalPrice?: number;
  discountExpiresAt?: string;
}

export interface UpdateCourseDto {
  title: string;
  description: string;
  price: number;
  categoryId?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | number;
  language?: 'Vi' | 'En' | number;
  isPublished?: boolean;
  publishedAt?: string;
  discountPercent?: number;
  finalPrice?: number;
  discountExpiresAt?: string;
}

export const courseService = {
  getAll: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    keyword?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minDurationInMinutes?: number;
    maxDurationInMinutes?: number;
    createdFrom?: string;
    createdTo?: string;
    sortBy?: string;
    isDescending?: boolean;
    includeDeleted?: boolean;
  }) => {
    const res = await adminApi.get('/AdminCourse', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await adminApi.get(`/AdminCourse/${id}`);
    return res.data;
  },

  create: async (data: CreateCourseDto) => {
    const res = await adminApi.post('/AdminCourse', data);
    return res.data;
  },

  update: async (id: string, data: UpdateCourseDto) => {
    const res = await adminApi.put(`/AdminCourse/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await adminApi.delete(`/AdminCourse/${id}`);
    return res.data;
  },

  restore: async (id: string) => {
    const res = await adminApi.post(`/AdminCourse/${id}/restore`);
    return res.data;
  },

  indexCourses: async () => {
    const res = await adminApi.post('/AdminCourse/index');
    return res.data;
  },
};

// Category APIs
export interface CategoryDetailsDto extends CategoryDto {
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  parentCategoryName?: string;
  subCategories?: CategoryDto[];
  courses?: any[];
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentCategoryId?: string;
}

export interface UpdateCategoryDto {
  name: string;
  description?: string;
  parentCategoryId?: string;
}

export const categoryService = {
  getAll: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    keyword?: string;
    sortBy?: string;
    isDescending?: boolean;
  }) => {
    const res = await adminApi.get('/AdminCategory', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await adminApi.get(`/AdminCategory/${id}`);
    return res.data;
  },

  create: async (data: CreateCategoryDto) => {
    const res = await adminApi.post('/AdminCategory', data);
    return res.data;
  },

  update: async (id: string, data: UpdateCategoryDto) => {
    const res = await adminApi.put(`/AdminCategory/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await adminApi.delete(`/AdminCategory/${id}`);
    return res.data;
  },

  restore: async (id: string) => {
    const res = await adminApi.post(`/AdminCategory/${id}/restore`);
    return res.data;
  },

  getDeleted: async () => {
    const res = await adminApi.get('/AdminCategory/deleted');
    return res.data;
  },

  getRoot: async () => {
    const res = await adminApi.get('/AdminCategory/root');
    return res.data;
  },

  getSubCategories: async (parentId: string) => {
    const res = await adminApi.get(`/AdminCategory/${parentId}/subcategories`);
    return res.data;
  },

  getWithHierarchy: async (id: string) => {
    const res = await adminApi.get(`/AdminCategory/${id}/hierarchy`);
    return res.data;
  },
};

// Promotion DTOs
export interface PromotionDto {
  id: string;
  name: string;
  description?: string;
  type: number; // 0 = Percentage
  value: number;
  scope: number; // 0 = All, 1 = Category, 2 = Course, 3 = SpecificCourses
  categoryId?: string;
  categoryName?: string;
  startDate: string;
  endDate: string;
  maxUsageCount?: number;
  usageCount: number;
  code?: string;
  requireCode: boolean;
  isActive: boolean;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  createdAt: string;
  updatedAt?: string;
  courseIds?: string[];
}

export interface CreatePromotionDto {
  name: string;
  description?: string;
  type: number;
  value: number;
  scope: number;
  categoryId?: string;
  startDate: string;
  endDate: string;
  maxUsageCount?: number;
  code?: string;
  requireCode?: boolean;
  isActive?: boolean;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  courseIds?: string[];
}

export interface UpdatePromotionDto {
  name?: string;
  description?: string;
  type?: number;
  value?: number;
  scope?: number;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  maxUsageCount?: number;
  code?: string;
  requireCode?: boolean;
  isActive?: boolean;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  courseIds?: string[];
}

export const promotionService = {
  getAll: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    keyword?: string;
    sortBy?: string;
    isDescending?: boolean;
    includeDeleted?: boolean;
  }) => {
    const res = await adminApi.get('/AdminPromotion', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await adminApi.get(`/AdminPromotion/${id}`);
    return res.data;
  },

  create: async (data: CreatePromotionDto) => {
    const res = await adminApi.post('/AdminPromotion', data);
    return res.data;
  },

  update: async (id: string, data: UpdatePromotionDto) => {
    const res = await adminApi.put(`/AdminPromotion/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await adminApi.delete(`/AdminPromotion/${id}`);
    return res.data;
  },

  restore: async (id: string) => {
    const res = await adminApi.post(`/AdminPromotion/${id}/restore`);
    return res.data;
  },

  activate: async (id: string) => {
    const res = await adminApi.post(`/AdminPromotion/${id}/activate`);
    return res.data;
  },

  deactivate: async (id: string) => {
    const res = await adminApi.post(`/AdminPromotion/${id}/deactivate`);
    return res.data;
  },

  getActive: async () => {
    const res = await adminApi.get('/AdminPromotion/active');
    return res.data;
  },

  getByCategory: async (categoryId: string) => {
    const res = await adminApi.get(`/AdminPromotion/category/${categoryId}`);
    return res.data;
  },
};

// Dashboard stats (mock for now, can be replaced with real API)
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [coursesRes, categoriesRes] = await Promise.all([
      courseService.getAll({ pageNumber: 1, pageSize: 10 }),
      categoryService.getAll({ pageNumber: 1, pageSize: 100 }),
    ]);

    const courses = coursesRes.data?.data || coursesRes.data || [];
    const categories = categoriesRes.data?.data || categoriesRes.data || [];

    return {
      totalCourses: Array.isArray(courses) ? courses.length : 0,
      publishedCourses: Array.isArray(courses)
        ? courses.filter((c: CourseDto) => c.isPublished).length
        : 0,
      totalCategories: Array.isArray(categories) ? categories.length : 0,
      totalUsers: 0, // Will be replaced with real API
      recentCourses: Array.isArray(courses) ? courses.slice(0, 5) : [],
      recentActivity: [],
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalCourses: 0,
      publishedCourses: 0,
      totalCategories: 0,
      totalUsers: 0,
      recentCourses: [],
      recentActivity: [],
    };
  }
};

