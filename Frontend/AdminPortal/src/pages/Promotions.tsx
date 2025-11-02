import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Eye,
  RotateCcw,
  Tag,
  Calendar,
  Percent,
  Globe,
  FolderTree,
  Power,
  PowerOff,
} from 'lucide-react';
import {
  promotionService,
  categoryService,
  courseService,
  PromotionDto,
  CreatePromotionDto,
  UpdatePromotionDto,
  CategoryDto,
  CourseDto,
} from '../services/adminService';
import { showToast } from '../components/ui/Toast';

type ViewMode = 'all' | 'active' | 'inactive' | 'deleted';

export default function Promotions() {
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<PromotionDto | null>(null);
  
  // Options for dropdowns
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);

  // Form state
  const [formData, setFormData] = useState<CreatePromotionDto>({
    name: '',
    description: '',
    type: 0, // Percentage
    value: 0,
    scope: 0, // All
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    requireCode: false,
  });
  const [editFormData, setEditFormData] = useState<UpdatePromotionDto>({});

  useEffect(() => {
    fetchPromotions();
    fetchCategories();
    fetchCourses();
  }, [searchTerm, viewMode]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await promotionService.getAll({
        keyword: searchTerm || undefined,
        sortBy: 'createdAt',
        isDescending: true,
        includeDeleted: viewMode === 'deleted',
      });
      const data = response?.data?.data || response?.data || [];
      if (Array.isArray(data)) {
        let filtered = data;
        if (viewMode === 'active') {
          filtered = data.filter((p: PromotionDto) => p.isActive && new Date(p.endDate) >= new Date());
        } else if (viewMode === 'inactive') {
          filtered = data.filter((p: PromotionDto) => !p.isActive || new Date(p.endDate) < new Date());
        }
        setPromotions(filtered);
      }
    } catch (error: any) {
      console.error('Failed to fetch promotions:', error);
      showToast(error.response?.data?.message || 'Failed to fetch promotions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      const data = response?.data?.data || response?.data || [];
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAll({ pageSize: 100 });
      const data = response?.data?.data || response?.data || [];
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Nếu requireCode = true thì code phải có
    if (formData.requireCode && !formData.code) {
      showToast('Vui lòng nhập mã giảm giá khi yêu cầu mã', 'error');
      return;
    }

    try {
      const response = await promotionService.create(formData);
      if (response?.success || response?.data) {
        showToast('Promotion created successfully!', 'success');
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          type: 0,
          value: 0,
          scope: 0,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isActive: true,
          requireCode: false,
          code: undefined,
          maxUsageCount: undefined,
          minimumOrderAmount: undefined,
          maximumDiscountAmount: undefined,
          courseIds: undefined,
        });
        await fetchPromotions();
      } else {
        showToast(response?.message || 'Failed to create promotion', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to create promotion', 'error');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromotion) return;
    
    // Validation: Nếu requireCode = true thì code phải có
    const requireCode = editFormData.requireCode ?? selectedPromotion.requireCode ?? false;
    const code = editFormData.code ?? selectedPromotion.code;
    if (requireCode && !code) {
      showToast('Vui lòng nhập mã giảm giá khi yêu cầu mã', 'error');
      return;
    }

    try {
      const response = await promotionService.update(selectedPromotion.id, editFormData);
      if (response?.success || response?.data) {
        showToast('Promotion updated successfully!', 'success');
        setShowEditModal(false);
        setSelectedPromotion(null);
        setEditFormData({});
        await fetchPromotions();
      } else {
        showToast(response?.message || 'Failed to update promotion', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update promotion', 'error');
    }
  };

  const handleDelete = async () => {
    if (!promotionToDelete) return;
    try {
      const response = await promotionService.delete(promotionToDelete.id);
      if (response?.success || response?.data) {
        showToast('Promotion deleted successfully!', 'success');
        setShowDeleteConfirm(false);
        setPromotionToDelete(null);
        await fetchPromotions();
      } else {
        showToast(response?.message || 'Failed to delete promotion', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete promotion', 'error');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await promotionService.restore(id);
      if (response?.success || response?.data) {
        showToast('Promotion restored successfully!', 'success');
        await fetchPromotions();
      } else {
        showToast(response?.message || 'Failed to restore promotion', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to restore promotion', 'error');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      const response = await promotionService.activate(id);
      if (response?.success || response?.data) {
        showToast('Promotion activated successfully!', 'success');
        await fetchPromotions();
      } else {
        showToast(response?.message || 'Failed to activate promotion', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to activate promotion', 'error');
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      const response = await promotionService.deactivate(id);
      if (response?.success || response?.data) {
        showToast('Promotion deactivated successfully!', 'success');
        await fetchPromotions();
      } else {
        showToast(response?.message || 'Failed to deactivate promotion', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to deactivate promotion', 'error');
    }
  };

  const openEditModal = async (promotion: PromotionDto) => {
    setSelectedPromotion(promotion);
    setEditFormData({
      name: promotion.name,
      description: promotion.description,
      value: promotion.value,
      scope: promotion.scope,
      categoryId: promotion.categoryId,
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      maxUsageCount: promotion.maxUsageCount,
      code: promotion.code,
      requireCode: promotion.requireCode,
      isActive: promotion.isActive,
      minimumOrderAmount: promotion.minimumOrderAmount,
      maximumDiscountAmount: promotion.maximumDiscountAmount,
      courseIds: promotion.courseIds,
    });
    setShowEditModal(true);
  };

  const openDetailsModal = async (id: string) => {
    try {
      const response = await promotionService.getById(id);
      const data = response?.data?.data || response?.data;
      if (data) {
        setSelectedPromotion(data);
        setShowDetailsModal(true);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to load promotion details', 'error');
    }
  };

  const formatScope = (scope: number) => {
    switch (scope) {
      case 0: return 'All Courses';
      case 1: return 'Category';
      case 2: return 'Course';
      case 3: return 'Specific Courses';
      default: return 'Unknown';
    }
  };

  const getStatusBadge = (promotion: PromotionDto) => {
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    if (!promotion.isActive) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Inactive</span>;
    }
    if (endDate < now) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Expired</span>;
    }
    if (promotion.maxUsageCount && promotion.usageCount >= promotion.maxUsageCount) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Used Up</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Promotions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage discounts and promotional offers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Promotion
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-4">
          {(['all', 'active', 'inactive', 'deleted'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                viewMode === mode
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={fetchPromotions}
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Promotions List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No promotions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                    {promotion.name}
                  </h3>
                  {promotion.code && (
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                      Code: {promotion.code}
                    </p>
                  )}
                </div>
                {getStatusBadge(promotion)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Percent className="w-4 h-4" />
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {promotion.value}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>{formatScope(promotion.scope)}</span>
                </div>
                {promotion.categoryName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FolderTree className="w-4 h-4" />
                    <span>{promotion.categoryName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(promotion.startDate).toLocaleDateString()} -{' '}
                    {new Date(promotion.endDate).toLocaleDateString()}
                  </span>
                </div>
                {promotion.maxUsageCount && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Used: {promotion.usageCount} / {promotion.maxUsageCount}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => openDetailsModal(promotion.id)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {viewMode !== 'deleted' && (
                  <>
                    <button
                      onClick={() => openEditModal(promotion)}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (promotion.isActive) {
                          handleDeactivate(promotion.id);
                        } else {
                          handleActivate(promotion.id);
                        }
                      }}
                      className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded"
                      title={promotion.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {promotion.isActive ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setPromotionToDelete(promotion);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {viewMode === 'deleted' && (
                  <button
                    onClick={() => handleRestore(promotion.id)}
                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                    title="Restore"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal - Simplified for space, you can expand */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create Promotion</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Mô tả về khuyến mãi..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Discount (%) *</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Scope *</label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: parseInt(e.target.value), categoryId: undefined, courseIds: undefined })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={0}>All Courses</option>
                  <option value={1}>Category</option>
                  <option value={3}>Specific Courses</option>
                </select>
              </div>
              {formData.scope === 1 && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Category</label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {formData.scope === 3 && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Courses</label>
                  <select
                    multiple
                    value={formData.courseIds || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                      setFormData({ ...formData, courseIds: selected });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Promotion Code Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mã giảm giá</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.requireCode || false}
                        onChange={(e) => setFormData({ ...formData, requireCode: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Yêu cầu mã giảm giá
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                      Khi bật, người dùng phải nhập mã để sử dụng khuyến mãi
                    </p>
                  </div>
                  
                  {formData.requireCode && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Mã giảm giá *
                      </label>
                      <input
                        type="text"
                        required={formData.requireCode}
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="VD: SALE2024, WELCOME50"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                        maxLength={50}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Mã sẽ được tự động chuyển thành chữ in hoa
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tùy chọn nâng cao</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                      Số lần sử dụng tối đa
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxUsageCount || ''}
                      onChange={(e) => setFormData({ ...formData, maxUsageCount: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="Không giới hạn (để trống)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Để trống nếu không muốn giới hạn số lần sử dụng
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Tổng giá trị tối thiểu (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.minimumOrderAmount || ''}
                        onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="0 (không yêu cầu)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tổng giá trị các khóa học trong giỏ hàng
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Giảm tối đa (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.maximumDiscountAmount || ''}
                        onChange={(e) => setFormData({ ...formData, maximumDiscountAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="Không giới hạn (để trống)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPromotion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Edit Promotion</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPromotion(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Description</label>
                <textarea
                  value={editFormData.description ?? selectedPromotion.description ?? ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={3}
                  placeholder="Mô tả về khuyến mãi..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Discount (%) *</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={editFormData.value || 0}
                  onChange={(e) => setEditFormData({ ...editFormData, value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Scope *</label>
                <select
                  value={editFormData.scope ?? 0}
                  onChange={(e) => setEditFormData({ ...editFormData, scope: parseInt(e.target.value), categoryId: undefined, courseIds: undefined })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={0}>All Courses</option>
                  <option value={1}>Category</option>
                  <option value={3}>Specific Courses</option>
                </select>
              </div>
              {(editFormData.scope === 1 || selectedPromotion.scope === 1) && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Category</label>
                  <select
                    value={editFormData.categoryId || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {(editFormData.scope === 3 || selectedPromotion.scope === 3) && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Courses</label>
                  <select
                    multiple
                    value={editFormData.courseIds || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                      setEditFormData({ ...editFormData, courseIds: selected });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={editFormData.startDate?.split('T')[0] || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">End Date *</label>
                  <input
                    type="date"
                    required
                    value={editFormData.endDate?.split('T')[0] || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Promotion Code Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mã giảm giá</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={editFormData.requireCode ?? selectedPromotion.requireCode ?? false}
                        onChange={(e) => setEditFormData({ ...editFormData, requireCode: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Yêu cầu mã giảm giá
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                      Khi bật, người dùng phải nhập mã để sử dụng khuyến mãi
                    </p>
                  </div>
                  
                  {(editFormData.requireCode ?? selectedPromotion.requireCode ?? false) && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Mã giảm giá *
                      </label>
                      <input
                        type="text"
                        required={editFormData.requireCode ?? selectedPromotion.requireCode ?? false}
                        value={editFormData.code ?? selectedPromotion.code ?? ''}
                        onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value.toUpperCase() })}
                        placeholder="VD: SALE2024, WELCOME50"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                        maxLength={50}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Mã sẽ được tự động chuyển thành chữ in hoa
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tùy chọn nâng cao</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                      Số lần sử dụng tối đa
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editFormData.maxUsageCount ?? selectedPromotion.maxUsageCount ?? ''}
                      onChange={(e) => setEditFormData({ ...editFormData, maxUsageCount: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="Không giới hạn (để trống)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Để trống nếu không muốn giới hạn số lần sử dụng
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Tổng giá trị tối thiểu (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editFormData.minimumOrderAmount ?? selectedPromotion.minimumOrderAmount ?? ''}
                        onChange={(e) => setEditFormData({ ...editFormData, minimumOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="0 (không yêu cầu)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tổng giá trị các khóa học trong giỏ hàng
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Giảm tối đa (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editFormData.maximumDiscountAmount ?? selectedPromotion.maximumDiscountAmount ?? ''}
                        onChange={(e) => setEditFormData({ ...editFormData, maximumDiscountAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="Không giới hạn (để trống)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPromotion(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPromotion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Promotion Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPromotion(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPromotion.name}</p>
              </div>
              {selectedPromotion.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                  <p className="text-gray-900 dark:text-white">{selectedPromotion.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Discount</label>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{selectedPromotion.value}% OFF</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Scope</label>
                  <p className="text-gray-900 dark:text-white">{formatScope(selectedPromotion.scope)}</p>
                </div>
              </div>
              {selectedPromotion.categoryName && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                  <p className="text-gray-900 dark:text-white">{selectedPromotion.categoryName}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                  <p className="text-gray-900 dark:text-white">{new Date(selectedPromotion.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                  <p className="text-gray-900 dark:text-white">{new Date(selectedPromotion.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {selectedPromotion.code && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Mã giảm giá</label>
                    <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">{selectedPromotion.code}</p>
                  </div>
                )}
                {selectedPromotion.requireCode !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Yêu cầu mã</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedPromotion.requireCode ? 'Có' : 'Không'}
                    </p>
                  </div>
                )}
              </div>
              {selectedPromotion.minimumOrderAmount && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Tổng giá trị tối thiểu</label>
                  <p className="text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPromotion.minimumOrderAmount)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    (Tổng giá trị các khóa học trong giỏ hàng)
                  </p>
                </div>
              )}
              {selectedPromotion.maximumDiscountAmount && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Giảm tối đa</label>
                  <p className="text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPromotion.maximumDiscountAmount)}
                  </p>
                </div>
              )}
              {selectedPromotion.maxUsageCount && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Usage</label>
                  <p className="text-gray-900 dark:text-white">{selectedPromotion.usageCount} / {selectedPromotion.maxUsageCount}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                {getStatusBadge(selectedPromotion)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && promotionToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Delete Promotion</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{promotionToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPromotionToDelete(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

