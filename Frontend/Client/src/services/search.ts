import { api } from './api';

export interface SearchSuggestion {
  text: string;
  type: 'course' | 'category';
}

export interface SearchResult {
  courseId: string;
  title: string;
  description: string;
  price: number;
  durationInMinutes: number;
  categoryId?: string;
  thumbnailUrl?: string;
  primaryImageUrl?: string;
  promoVideoUrl?: string;
  discountPercent?: number;
  finalPrice?: number;
  discountExpiresAt?: string;
  hasDiscount: boolean;
  effectivePrice: number;
  currency?: string;
}

/**
 * Elasticsearch search service for courses
 */
export class SearchService {
  /**
   * Get autocomplete suggestions from Elasticsearch
   * @param prefix - Search prefix
   * @param size - Number of suggestions to return
   * @returns Promise<string[]> - Array of suggestion strings
   */
  static async getAutocompleteSuggestions(prefix: string, size = 10): Promise<string[]> {
    try {
      if (!prefix.trim()) {
        return [];
      }

      const response = await api.get('/api/course/autocomplete', {
        params: { prefix: prefix.trim(), size }
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      return [];
    }
  }

  /**
   * Search courses using Elasticsearch
   * @param keyword - Search keyword
   * @returns Promise<SearchResult[]> - Array of search results
   */
  static async searchCourses(keyword: string): Promise<SearchResult[]> {
    try {
      if (!keyword.trim()) {
        return [];
      }

      const response = await api.get('/api/course/search', {
        params: { keyword: keyword.trim() }
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map((course: any) => ({
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

  /**
   * Search with debouncing for better UX
   * @param keyword - Search keyword
   * @param delay - Debounce delay in milliseconds
   * @returns Promise<SearchResult[]> - Array of search results
   */
  static debouncedSearch(keyword: string, delay = 300): Promise<SearchResult[]> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(async () => {
        const results = await this.searchCourses(keyword);
        resolve(results);
      }, delay);

      // Return a promise that can be cancelled
      return () => clearTimeout(timeoutId);
    });
  }

  /**
   * Get search suggestions with debouncing
   * @param prefix - Search prefix
   * @param delay - Debounce delay in milliseconds
   * @returns Promise<string[]> - Array of suggestions
   */
  static debouncedAutocomplete(prefix: string, delay = 200): Promise<string[]> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(async () => {
        const suggestions = await this.getAutocompleteSuggestions(prefix);
        resolve(suggestions);
      }, delay);

      // Return a promise that can be cancelled
      return () => clearTimeout(timeoutId);
    });
  }
}

// Export convenience functions
export const searchCourses = SearchService.searchCourses;
export const getAutocompleteSuggestions = SearchService.getAutocompleteSuggestions;
export const debouncedSearch = SearchService.debouncedSearch;
export const debouncedAutocomplete = SearchService.debouncedAutocomplete;
