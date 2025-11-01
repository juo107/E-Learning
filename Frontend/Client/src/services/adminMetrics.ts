import api from './api';

export interface AdminSummaryDto {
  totalUsers: number;
  activeUsers24h: number;
  totalCourses: number;
  publishedCourses: number;
  pendingCourses: number;
  totalEnrollments: number;
  averageRating: number;
  reviewsCount: number;
  generatedAtUtc: string;
}

export interface AdminMetricsResponse {
  success: boolean;
  data: AdminSummaryDto;
  message?: string;
}

export const adminMetricsService = {
  async getSummary(): Promise<AdminSummaryDto> {
    try {
      const response = await api.get<AdminMetricsResponse>('/admin/metrics/summary');
      
      // Handle both wrapped and raw responses
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data;
        } else {
          return response.data as AdminSummaryDto;
        }
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Failed to fetch admin metrics:', error);
      throw error;
    }
  }
};
