import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  FolderTree,
  X,
  Save,
  Eye,
  RotateCcw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  categoryService,
  CategoryDto,
  CategoryDetailsDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../services/adminService';
import { showToast } from '../components/ui/Toast';

type ViewMode = 'all' | 'root' | 'deleted';

export default function Categories() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [rootCategories, setRootCategories] = useState<CategoryDto[]>([]);
  const [deletedCategories, setDeletedCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryDetailsDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [subCategoriesMap, setSubCategoriesMap] = useState<Map<string, CategoryDto[]>>(new Map());

  // Form state
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    description: '',
    parentCategoryId: undefined,
  });
  const [editFormData, setEditFormData] = useState<UpdateCategoryDto>({
    name: '',
    description: '',
    parentCategoryId: undefined,
  });

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, viewMode]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      let response;
      let data;
      
      if (viewMode === 'root') {
        response = await categoryService.getRoot();
        data = response?.data?.data || response?.data || [];
        if (Array.isArray(data)) {
          setRootCategories(data);
        }
      } else if (viewMode === 'deleted') {
        response = await categoryService.getDeleted();
        data = response?.data?.data || response?.data || [];
        if (Array.isArray(data)) {
          setDeletedCategories(data);
        }
      } else {
        response = await categoryService.getAll({
          keyword: searchTerm || undefined,
        });
        data = response?.data?.data || response?.data || [];
        if (Array.isArray(data)) {
          setCategories(data);
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Failed to fetch categories';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await categoryService.create(formData);
      // Kiểm tra response thành công (có thể response.success hoặc response.data.success)
      const isSuccess = response?.success === true || 
                       (response?.data && response.data?.success === true) ||
                       (response?.success !== false && response?.data);
      
      if (isSuccess) {
        showToast('Category created successfully!', 'success');
        setShowCreateModal(false);
        setFormData({ name: '', description: '', parentCategoryId: undefined });
        await fetchCategories();
      } else {
        const errorMsg = response?.message || response?.data?.message || 'Failed to create category';
        showToast(errorMsg, 'error');
      }
    } catch (error: any) {
      console.error('Failed to create category:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Failed to create category';
      showToast(errorMessage, 'error');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      const response = await categoryService.update(selectedCategory.id, editFormData);
      // Kiểm tra response thành công (có thể response.success hoặc response.data.success)
      const isSuccess = response?.success === true || 
                       (response?.data && response.data?.success === true) ||
                       (response?.success !== false && response?.data);
      
      if (isSuccess) {
        showToast('Category updated successfully!', 'success');
        setShowEditModal(false);
        setSelectedCategory(null);
        // Clear expanded categories và subcategories map để refresh
        setExpandedCategories(new Set());
        setSubCategoriesMap(new Map());
        await fetchCategories();
      } else {
        const errorMsg = response?.message || response?.data?.message || 'Failed to update category';
        showToast(errorMsg, 'error');
      }
    } catch (error: any) {
      console.error('Failed to update category:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Failed to update category';
      showToast(errorMessage, 'error');
    }
  };

  const handleDeleteClick = (category: CategoryDto) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      const response = await categoryService.delete(categoryToDelete.id);
      if (response?.success !== false) {
        showToast('Category deleted successfully!', 'success');
        // Clear expanded categories và subcategories map để refresh
        setExpandedCategories(new Set());
        setSubCategoriesMap(new Map());
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);
        await fetchCategories();
      } else {
        showToast(response?.message || 'Failed to delete category', 'error');
      }
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Failed to delete category';
      showToast(errorMessage, 'error');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await categoryService.restore(id);
      if (response?.success !== false) {
        showToast('Category restored successfully!', 'success');
        await fetchCategories();
      } else {
        showToast(response?.message || 'Failed to restore category', 'error');
      }
    } catch (error: any) {
      console.error('Failed to restore category:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Failed to restore category';
      showToast(errorMessage, 'error');
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await categoryService.getWithHierarchy(id);
      const data = response.data?.data || response.data;
      setSelectedCategory(data);
      setEditFormData({
        name: data.name,
        description: data.description || '',
        parentCategoryId: data.parentCategoryId,
      });
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error('Failed to fetch category details:', error);
      showToast('Failed to fetch category details', 'error');
    }
  };

  const handleEditClick = async (category: CategoryDto) => {
    try {
      const response = await categoryService.getById(category.id);
      const data = response.data?.data || response.data;
      setSelectedCategory(data);
      setEditFormData({
        name: data.name,
        description: data.description || '',
        parentCategoryId: data.parentCategoryId,
      });
      setShowEditModal(true);
    } catch (error: any) {
      console.error('Failed to fetch category:', error);
      showToast('Failed to fetch category', 'error');
    }
  };

  const toggleSubCategories = async (categoryId: string) => {
    if (expandedCategories.has(categoryId)) {
      const newExpanded = new Set(expandedCategories);
      newExpanded.delete(categoryId);
      setExpandedCategories(newExpanded);
    } else {
      try {
        const response = await categoryService.getSubCategories(categoryId);
        const data = response.data?.data || response.data || [];
        const subCategories = Array.isArray(data) ? data : [];

        setSubCategoriesMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(categoryId, subCategories);
          return newMap;
        });

        const newExpanded = new Set(expandedCategories);
        newExpanded.add(categoryId);
        setExpandedCategories(newExpanded);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    }
  };

  const displayCategories =
    viewMode === 'root'
      ? rootCategories
      : viewMode === 'deleted'
      ? deletedCategories
      : categories;

  const getParentCategoryName = (parentId?: string) => {
    if (!parentId) return null;
    const allCategories = [...categories, ...rootCategories];
    const parent = allCategories.find((c) => c.id === parentId);
    return parent?.name;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categories Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your content with categories
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', description: '', parentCategoryId: undefined });
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'all'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Categories
        </button>
        <button
          onClick={() => setViewMode('root')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'root'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Root Categories
        </button>
        <button
          onClick={() => setViewMode('deleted')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'deleted'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Deleted
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchCategories}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : displayCategories.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No categories found</p>
          </div>
        ) : (
          displayCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {viewMode !== 'deleted' && (
                      <button
                        onClick={() => toggleSubCategories(category.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    )}
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                      <FolderTree className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      {category.parentCategoryId && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Parent: {getParentCategoryName(category.parentCategoryId)}
                        </p>
                      )}
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                    {category.updatedAt && (
                      <span>
                        Updated: {new Date(category.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.has(category.id) &&
                    subCategoriesMap.get(category.id) && (
                      <div className="mt-4 ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-800 space-y-3">
                        {subCategoriesMap.get(category.id)!.map((sub) => (
                          <div
                            key={sub.id}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {sub.name}
                              </p>
                              {sub.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleViewDetails(sub.id)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditClick(sub)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(sub)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {subCategoriesMap.get(category.id)!.length === 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No subcategories
                          </p>
                        )}
                      </div>
                    )}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => handleViewDetails(category.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {viewMode !== 'deleted' && (
                    <>
                      <button
                        onClick={() => handleEditClick(category)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {viewMode === 'deleted' && (
                    <button
                      onClick={() => handleRestore(category.id)}
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-lg transition-colors"
                      title="Restore"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Category
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Parent Category
                </label>
                <select
                  value={formData.parentCategoryId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parentCategoryId: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">None (Root Category)</option>
                  {[...categories, ...rootCategories]
                    .filter((c) => c.id !== formData.parentCategoryId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Category
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Parent Category
                </label>
                <select
                  value={editFormData.parentCategoryId || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      parentCategoryId: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">None (Root Category)</option>
                  {[...categories, ...rootCategories]
                    .filter((c) => c.id !== selectedCategory.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Category Details
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCategory(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedCategory.name}
                </h3>
                {selectedCategory.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedCategory.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedCategory.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedCategory.updatedAt && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedCategory.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedCategory.parentCategoryName && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Parent Category
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedCategory.parentCategoryName}
                    </p>
                  </div>
                )}
              </div>
              {selectedCategory.subCategories &&
                selectedCategory.subCategories.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subcategories ({selectedCategory.subCategories.length})
                    </p>
                    <div className="space-y-2">
                      {selectedCategory.subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <p className="font-medium text-gray-900 dark:text-white">
                            {sub.name}
                          </p>
                          {sub.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {sub.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {selectedCategory.courses && selectedCategory.courses.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Courses ({selectedCategory.courses.length})
                  </p>
                  <div className="space-y-2">
                    {selectedCategory.courses.map((course: any) => (
                      <div
                        key={course.id}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowEditModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedCategory(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                Confirm Delete
              </h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCategoryToDelete(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Are you sure you want to delete this category?
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {categoryToDelete.name}
                    </span>
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    ⚠️ This action cannot be undone. The category will be moved to deleted items.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setCategoryToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
