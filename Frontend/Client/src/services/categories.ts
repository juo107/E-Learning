import api from './api';

export type CategoryItem = {
  id: string; // Changed from number to string to match backend Guid
  name: string;
  slug?: string;
  subcategories?: Array<{ id?: string; name: string; slug?: string }>; // Changed id type to string
};

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const res = await api.get('/api/category'); // Use original API endpoint
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

    // Group categories by parent to create hierarchical structure
    const parentCategories = new Map<string, CategoryItem>();
    const subcategories: any[] = [];

    // First pass: separate parent categories and subcategories
    categoriesData.forEach((category: any) => {
      // Only process categories with valid IDs
      if (!category.id || typeof category.id !== 'string') {
        return; // Skip invalid categories
      }
      
      if (category.parentCategoryId) {
        // This is a subcategory
        subcategories.push(category);
      } else {
        // This is a parent category
        parentCategories.set(category.id, {
          id: category.id,
          name: category.name,
          slug: category.name?.toLowerCase().replace(/\s+/g, '-'),
          subcategories: []
        });
      }
    });

    // If no parent categories found, create them from subcategories
    if (parentCategories.size === 0) {
      // Group subcategories by their parentCategoryId
      const parentGroups = new Map<string, any[]>();
      subcategories.forEach((sub: any) => {
        const parentId = sub.parentCategoryId;
        if (!parentGroups.has(parentId)) {
          parentGroups.set(parentId, []);
        }
        parentGroups.get(parentId)!.push(sub);
      });

      // Create parent categories from groups
      parentGroups.forEach((subs, parentId) => {
        // Use the first subcategory to get parent info
        const firstSub = subs[0];
        const parentName = firstSub.parentCategoryName || `Category ${parentId.substring(0, 8)}`;
        
        parentCategories.set(parentId, {
          id: parentId,
          name: parentName,
          slug: parentName?.toLowerCase().replace(/\s+/g, '-'),
          subcategories: []
        });
      });
    }

    // Second pass: add subcategories to their parent categories
    subcategories.forEach((subcategory: any) => {
      const parentId = subcategory.parentCategoryId;
      
      // Only add to parent if it exists in our map (real categories from database)
      if (parentCategories.has(parentId)) {
        const parent = parentCategories.get(parentId)!;
        parent.subcategories!.push({
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.name?.toLowerCase().replace(/\s+/g, '-')
        });
      }
    });

    // Convert Map to Array
    return Array.from(parentCategories.values());
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return []; // Return empty array instead of fallback
  }
}


