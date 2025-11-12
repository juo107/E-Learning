import api from './api';

export type CategoryItem = {
  id: string; // Changed from number to string to match backend Guid
  name: string;
  slug?: string;
  subcategories?: Array<{ id?: string; name: string; slug?: string }>; // Changed id type to string
};

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    // Use root categories endpoint which is optimized with Redis cache for mega menu
    // This endpoint returns root categories with subcategories already included
    const res = await api.get('/api/category/root');
    const raw = res.data;
    
    // Handle different response formats
    let categoriesData: any[];
    if (raw && Array.isArray(raw.data)) {
      categoriesData = raw.data;
    } else if (raw && Array.isArray(raw)) {
      categoriesData = raw;
    } else {
      categoriesData = [];
    }

    // Map root categories with their subcategories (already included from backend)
    return categoriesData
      .filter((category: any) => category.id && typeof category.id === 'string')
      .map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.name?.toLowerCase().replace(/\s+/g, '-'),
        subcategories: (category.subCategories || category.subcategories || []).map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.name?.toLowerCase().replace(/\s+/g, '-')
        }))
      }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return []; // Return empty array instead of fallback
  }
}


