import api from './api';

export type CourseCardDto = {
  courseId: string; // Changed from number to string to match backend Guid
  title: string;
  shortDescription: string;
  price: number;
  discountPrice: number | null;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  enrollmentCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  categoryName?: string;
  categoryId?: string; // Changed from number to string
  level?: string;
  language?: string;
  teacherName?: string;
  createdAt: string;
  thumbnailUrl?: string | null;
  // Media fields from CourseMedia
  primaryImageUrl?: string | null;
  promoVideoUrl?: string | null;
  // New discount fields from backend
  discountPercent?: number | null;
  finalPrice?: number | null;
  discountExpiresAt?: string | null;
  // Computed fields
  hasDiscount: boolean;
  effectivePrice: number;
  currency?: string;
};

export type LessonDto = {
  lessonId: number;
  courseId: number;
  title: string;
  contentUrl?: string;
  orderIndex: number;
  durationSec: number;
};

export type ReviewDto = {
  reviewId: number;
  userId: number;
  courseId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CourseDetailDto = {
  courseId: number;
  title: string;
  slug?: string;
  shortDescription: string;
  description?: string;
  categoryName?: string;
  categoryId?: number;
  level?: string;
  language?: string;
  teacherName?: string;
  teacherId?: number;
  price: number;
  discountPrice: number | null;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  enrollmentCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  lessons?: LessonDto[];
  tags?: string[];
  reviews?: ReviewDto[];
  thumbnailUrl?: string | null;
  // Media fields from CourseMedia
  primaryImageUrl?: string | null;
  promoVideoUrl?: string | null;
  // Discount fields
  discountPercent?: number | null;
  finalPrice?: number | null;
  discountExpiresAt?: string | null;
  // Computed fields
  effectivePrice: number;
  hasDiscount: boolean;
  currency?: string;
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

export async function fetchCourses(page = 1, pageSize = 12, opts: { 
  search?: string; 
  categoryId?: string; 
  category?: string; 
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  sortBy?: string;
  isDescending?: boolean;
} = {}): Promise<Paginated<CourseCardDto>> {
  const params: any = { pageNumber: page, pageSize };
  if (opts.search) params.keyword = opts.search;
  if (opts.categoryId) params.categoryId = opts.categoryId;
  if (opts.category) params.category = opts.category;
  if (opts.minPrice != null) params.minPrice = opts.minPrice;
  if (opts.maxPrice != null) params.maxPrice = opts.maxPrice;
  if (opts.minDuration != null) params.minDurationInMinutes = opts.minDuration;
  if (opts.maxDuration != null) params.maxDurationInMinutes = opts.maxDuration;
  if (opts.sortBy) params.sortBy = opts.sortBy;
  if (opts.isDescending != null) params.isDescending = opts.isDescending;
  const res = await api.get(`/api/course`, { params }); // Changed from /api/courses to /api/course
  const raw = res.data;
  
  // Handle the actual API response format: { data: T[], message, success }
  let paginatedData: any;
  if (raw && Array.isArray(raw.data)) {
    // API returns: { data: T[], message, success }
    // Since backend doesn't return pagination info, we'll work with what we have
    const actualCount = raw.data.length;
    const hasMorePages = actualCount === pageSize; // If we got full page, there might be more
    
    paginatedData = {
      data: raw.data,
      pageNumber: page,
      pageSize: pageSize,
      totalCount: actualCount, // Only count of current page
      totalPages: hasMorePages ? page + 1 : page, // Estimate: current page + 1 if full page
      hasPreviousPage: page > 1,
      hasNextPage: hasMorePages
    };
  } else {
    throw new Error('Unexpected API response format');
  }

  // Map backend CourseDto to frontend CourseCardDto
  const mappedData = paginatedData.data?.map((course: any) => ({
    courseId: course.id,
    title: course.title || '',
    shortDescription: course.description || '',
    price: course.price || 0,
    discountPrice: course.finalPrice || null,
    averageRating: 0, // Backend doesn't have this yet
    ratingCount: 0, // Backend doesn't have this yet
    viewCount: 0, // Backend doesn't have this yet
    enrollmentCount: 0, // Backend doesn't have this yet
    isPublished: true, // Backend doesn't have this yet
    isFeatured: false, // Backend doesn't have this yet
    categoryName: course.categoryName,
    categoryId: course.categoryId,
    createdAt: course.createdAt,
    thumbnailUrl: course.thumbnailUrl ?? null,
    // Media fields from CourseMedia
    primaryImageUrl: course.primaryImageUrl ?? null,
    promoVideoUrl: course.promoVideoUrl ?? null,
    // New discount fields
    discountPercent: course.discountPercent ?? null,
    finalPrice: course.finalPrice ?? null,
    discountExpiresAt: course.discountExpiresAt ?? null,
    // Computed fields
    hasDiscount: !!(course.discountPercent != null && course.discountPercent > 0),
    effectivePrice: course.finalPrice ?? course.price ?? 0,
    currency: 'VND' // Default currency
  })) || [];

  return {
    data: mappedData,
    totalCount: paginatedData.totalCount || 0,
    pageNumber: paginatedData.pageNumber || 1,
    pageSize: paginatedData.pageSize || 12,
    totalPages: paginatedData.totalPages || 1,
    hasPreviousPage: paginatedData.hasPreviousPage || false,
    hasNextPage: paginatedData.hasNextPage || false
  };
}

export async function fetchCourseById(id: string): Promise<CourseDetailDto> {
  try {
    const res = await api.get(`/api/course/${id}`);
    const course = res.data?.data ?? res.data;
    
    // Map backend CourseDetailsDto to frontend CourseDetailDto
    return {
      courseId: course.id,
      title: course.title || '',
      shortDescription: course.description || '',
      description: course.description,
      price: course.price || 0,
      discountPrice: course.finalPrice || null,
      averageRating: 0, // Backend doesn't have this yet
      ratingCount: 0, // Backend doesn't have this yet
      viewCount: 0, // Backend doesn't have this yet
      enrollmentCount: 0, // Backend doesn't have this yet
      isPublished: true, // Backend doesn't have this yet
      isFeatured: false, // Backend doesn't have this yet
      categoryName: course.categoryName,
      categoryId: course.categoryId,
      level: undefined, // Backend doesn't have this yet
      language: undefined, // Backend doesn't have this yet
      teacherName: undefined, // Backend doesn't have this yet
      createdAt: course.createdAt,
      updatedAt: course.updatedAt || course.createdAt,
      thumbnailUrl: course.thumbnailUrl ?? null,
      // Media fields from CourseMedia
      primaryImageUrl: course.primaryImageUrl ?? null,
      promoVideoUrl: course.promoVideoUrl ?? null,
      slug: undefined, // Backend doesn't have this yet
      lessons: [], // Backend doesn't have this yet
      reviews: [], // Backend doesn't have this yet
      // New discount fields
      discountPercent: course.discountPercent ?? null,
      finalPrice: course.finalPrice ?? null,
      discountExpiresAt: course.discountExpiresAt ?? null,
      // Computed fields
      hasDiscount: !!(course.discountPercent != null && course.discountPercent > 0),
      effectivePrice: course.finalPrice ?? course.price ?? 0,
      currency: 'VND'
    };
  } catch (e) {
    // Fallback: minimal shape if backend route not available
    return {
      courseId: 0, // Fallback for GUID
      title: `Course #${id}`,
      shortDescription: 'Course details are not available from API. This is a placeholder.',
      price: 0,
      discountPrice: null,
      averageRating: 0,
      ratingCount: 0,
      viewCount: 0,
      enrollmentCount: 0,
      isPublished: false,
      isFeatured: false,
      categoryName: undefined,
      categoryId: undefined,
      level: undefined,
      language: undefined,
      teacherName: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnailUrl: null,
      slug: undefined,
      description: undefined,
      lessons: [],
      reviews: [],
      // New discount fields
      discountPercent: null,
      finalPrice: null,
      discountExpiresAt: null,
      // Computed fields
      hasDiscount: false,
      effectivePrice: 0,
      currency: 'VND'
    };
  }
}

// New optimized API functions
export async function fetchCoursesByCategory(
  categoryId: number, 
  page = 1, 
  pageSize = 12, 
  sortBy = 'createdAt', 
  ascending = false
): Promise<Paginated<CourseCardDto>> {
  const params = { 
    pageNumber: page, 
    pageSize, 
    categoryId, 
    sortBy, 
    ascending 
  };
  const res = await api.get(`/api/courses/category/${categoryId}`, { params });
  return res.data?.data ?? res.data;
}

export async function fetchFeaturedCoursesByCategory(
  categoryId: number, 
  limit = 10
): Promise<CourseCardDto[]> {
  const res = await api.get(`/api/courses/category/${categoryId}/featured`, { 
    params: { limit } 
  });
  return res.data?.data ?? res.data;
}

export async function fetchCoursesByCategories(
  categoryIds: number[], 
  page = 1, 
  pageSize = 12
): Promise<Paginated<CourseCardDto>> {
  const params = { 
    pageNumber: page, 
    pageSize, 
    categoryIds: categoryIds.join(',') 
  };
  const res = await api.get(`/api/courses/categories`, { params });
  return res.data?.data ?? res.data;
}

export async function fetchCoursesByCategoryAndPrice(
  categoryId: number,
  minPrice?: number,
  maxPrice?: number,
  page = 1,
  pageSize = 12
): Promise<Paginated<CourseCardDto>> {
  const params = { 
    pageNumber: page, 
    pageSize, 
    categoryId,
    minPrice,
    maxPrice
  };
  const res = await api.get(`/api/courses/category/${categoryId}/price`, { params });
  return res.data?.data ?? res.data;
}

export async function fetchCoursesByCategoryAndLevel(
  categoryId: number,
  level: string,
  page = 1,
  pageSize = 12
): Promise<Paginated<CourseCardDto>> {
  const params = { 
    pageNumber: page, 
    pageSize, 
    categoryId,
    level
  };
  const res = await api.get(`/api/courses/category/${categoryId}/level`, { params });
  return res.data?.data ?? res.data;
}

export async function fetchCategoryStats(categoryId: number): Promise<{
  totalCourses: number;
  publishedCourses: number;
  featuredCourses: number;
  totalEnrollments: number;
  totalViews: number;
  averageRating: number;
  averagePrice: number;
}> {
  // Backend doesn't have category stats endpoint yet, return mock data
  return {
    totalCourses: 0,
    publishedCourses: 0,
    featuredCourses: 0,
    totalEnrollments: 0,
    totalViews: 0,
    averageRating: 0,
    averagePrice: 0
  };
}

// Search courses by keyword using Elasticsearch
export async function searchCourses(keyword: string): Promise<CourseCardDto[]> {
  try {
    const res = await api.get('/api/course/search', { 
      params: { keyword: keyword.trim() }
    });
    const raw = res.data;
    
    if (raw && raw.success && Array.isArray(raw.data)) {
      return raw.data.map((course: any) => ({
        courseId: course.id,
        title: course.title || '',
        description: course.description || '',
        price: course.price || 0,
        durationInMinutes: course.durationInMinutes || 0,
        categoryId: course.categoryId,
        thumbnailUrl: course.thumbnailUrl,
        primaryImageUrl: course.primaryImageUrl,
        promoVideoUrl: course.promoVideoUrl,
        discountPercent: course.discountPercent,
        finalPrice: course.finalPrice,
        discountExpiresAt: course.discountExpiresAt,
        hasDiscount: Boolean(course.discountPercent && course.discountPercent > 0),
        effectivePrice: course.finalPrice || course.price || 0,
        currency: 'VND'
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching courses:', error);
    return [];
  }
}

// Get autocomplete suggestions using Elasticsearch
export async function getAutocompleteSuggestions(prefix: string, size = 10): Promise<string[]> {
  try {
    const res = await api.get('/api/course/autocomplete', { 
      params: { prefix: prefix.trim(), size }
    });
    const raw = res.data;
    
    if (raw && raw.success && Array.isArray(raw.data)) {
      return raw.data;
    }

    return [];
  } catch (error) {
    console.error('Error getting autocomplete suggestions:', error);
    return [];
  }
}


