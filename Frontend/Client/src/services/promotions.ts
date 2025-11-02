import api from './api';

export interface PromotionDto {
  id: string;
  name: string;
  description?: string;
  type: number; // PromotionType enum (0 = Percentage)
  value: number; // Discount percentage
  scope: number; // PromotionScope enum (0 = All, 1 = Category, 2 = SpecificCourses)
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

export interface ActivePromotionsResponse {
  success: boolean;
  data: PromotionDto[];
  message?: string;
}

/**
 * Lấy danh sách active promotions cho client
 */
export async function fetchActivePromotions(): Promise<ActivePromotionsResponse> {
  try {
    // Thêm timestamp để tránh cache ở browser/HTTP level
    const res = await api.get('/api/promotion/active', {
      params: {
        _t: Date.now() // Timestamp để force fresh request
      }
    });
    const raw = res.data;

    // Handle response format: { success, data, message }
    if (raw && Array.isArray(raw.data)) {
      return {
        success: raw.success ?? true,
        data: raw.data,
        message: raw.message,
      };
    }

    return {
      success: false,
      data: [],
      message: 'Invalid response format',
    };
  } catch (error: any) {
    console.error('Failed to fetch active promotions:', error);
    return {
      success: false,
      data: [],
      message: error?.message || 'Failed to fetch promotions',
    };
  }
}

/**
 * Lấy promotions theo category ID
 */
export async function fetchPromotionsByCategory(categoryId: string): Promise<ActivePromotionsResponse> {
  try {
    // Thêm timestamp để tránh cache ở browser/HTTP level
    const res = await api.get(`/api/promotion/category/${categoryId}`, {
      params: {
        _t: Date.now() // Timestamp để force fresh request
      }
    });
    const raw = res.data;

    if (raw && Array.isArray(raw.data)) {
      return {
        success: raw.success ?? true,
        data: raw.data,
        message: raw.message,
      };
    }

    return {
      success: false,
      data: [],
      message: 'Invalid response format',
    };
  } catch (error: any) {
    console.error('Failed to fetch promotions by category:', error);
    return {
      success: false,
      data: [],
      message: error?.message || 'Failed to fetch promotions',
    };
  }
}

/**
 * Tìm promotion tốt nhất (có discount cao nhất) từ danh sách active promotions
 */
export function getBestPromotion(promotions: PromotionDto[]): PromotionDto | null {
  if (!promotions || promotions.length === 0) return null;

  // Lọc promotions đang active và trong thời gian hiệu lực
  // Parse dates đúng cách với timezone
  const parseDate = (dateString: string | Date): Date => {
    if (dateString instanceof Date) return dateString;
    if (typeof dateString === 'string') {
      // Nếu có timezone info, parse trực tiếp
      if (dateString.includes('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
        return new Date(dateString);
      }
      // Nếu không có timezone, treat như UTC
      return new Date(dateString + 'Z');
    }
    return new Date(dateString);
  };

  const now = new Date();
  const validPromotions = promotions.filter((p) => {
    if (!p.isActive) return false;
    const startDate = parseDate(p.startDate);
    const endDate = parseDate(p.endDate);
    return now >= startDate && now <= endDate;
  });

  if (validPromotions.length === 0) return null;

  // Tìm promotion có value (discount %) cao nhất
  return validPromotions.reduce((best, current) => {
    return current.value > best.value ? current : best;
  }, validPromotions[0]);
}

/**
 * Tạo link chuyển hướng dựa trên promotion scope
 */
export function getPromotionLink(promotion: PromotionDto): string {
  if (promotion.scope === 1 && promotion.categoryId) {
    // Category scope - link đến category
    return `/courses?category=${promotion.categoryId}`;
  } else if (promotion.scope === 2 && promotion.courseIds && promotion.courseIds.length > 0) {
    // SpecificCourses scope - link đến course đầu tiên hoặc courses page với filter
    return `/course/${promotion.courseIds[0]}`;
  } else {
    // All scope - link đến courses page
    return '/courses';
  }
}

