import { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Save,
  BookOpen,
  RotateCcw,
  Filter,
  Download,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  courseService,
  CourseDto,
  CourseDetailsDto,
  CreateCourseDto,
  UpdateCourseDto,
} from '../services/adminService';
import { categoryService, CategoryDto } from '../services/adminService';
import { showToast } from '../components/ui/Toast';

type ViewMode = 'all' | 'deleted';

export default function Courses() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [showFilters, setShowFilters] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const filterSectionRef = useRef<HTMLDivElement>(null);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailsDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [showIndexModal, setShowIndexModal] = useState(false);
  const pageSize = 10;

  // Filters
  const [filters, setFilters] = useState({
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
    createdFrom: '',
    createdTo: '',
    level: '',
    language: '',
    isPublished: '',
    sortBy: 'createdAt',
    isDescending: true,
  });

  // Form state
  const [formData, setFormData] = useState<CreateCourseDto>({
    title: '',
    description: '',
    price: 0,
    durationInMinutes: 0,
    categoryId: undefined,
    level: 'Beginner',
    language: 'Vi',
    isPublished: false,
  });

  const [editFormData, setEditFormData] = useState<UpdateCourseDto>({
    title: '',
    description: '',
    price: 0,
    categoryId: undefined,
    level: 'Beginner',
    language: 'Vi',
    isPublished: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce filter changes to avoid too many API calls
  useEffect(() => {
    // Clear previous timeout
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    // Set loading state immediately for better UX
    setIsFiltering(true);

    // Debounce the actual fetch
    filterTimeoutRef.current = setTimeout(() => {
      fetchCourses();
    }, 300); // 300ms debounce

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [page, searchTerm, filters, viewMode]);

  // Scroll to filter section smoothly when filters change (but not on initial load)
  useEffect(() => {
    // Only scroll if we have courses (not initial load)
    if (courses.length > 0 && filterSectionRef.current) {
      filterSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [filters, searchTerm, viewMode]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll({ pageSize: 1000 });
      const data = response.data?.data || response.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    setIsFiltering(true);
    try {
      const params: any = {
        pageNumber: page,
        pageSize,
        keyword: searchTerm || undefined,
        includeDeleted: viewMode === 'deleted',
        sortBy: filters.sortBy,
        isDescending: filters.isDescending,
      };

      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      if (filters.minDuration) params.minDurationInMinutes = parseInt(filters.minDuration);
      if (filters.maxDuration) params.maxDurationInMinutes = parseInt(filters.maxDuration);
      if (filters.createdFrom) params.createdFrom = filters.createdFrom;
      if (filters.createdTo) params.createdTo = filters.createdTo;
      if (filters.level) params.level = filters.level;
      if (filters.language) params.language = filters.language;
      if (filters.isPublished === 'published') {
        params.onlyPublished = true;
      } else if (filters.isPublished === 'draft') {
        params.onlyDraft = true;
      }

      const response = await courseService.getAll(params);
      const data = response.data?.data || response.data || [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      showToast('Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseService.create(formData);
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        price: 0,
        durationInMinutes: 0,
        categoryId: undefined,
        level: 'Beginner',
        language: 'Vi',
        isPublished: false,
      });
      showToast('Course created successfully!', 'success');
      fetchCourses();
    } catch (error: any) {
      console.error('Failed to create course:', error);
      showToast(error.response?.data?.message || 'Failed to create course', 'error');
    }
  };

  // Helper function to convert level string to enum number
  const levelToEnum = (level: string): number => {
    switch (level) {
      case 'Beginner':
        return 0;
      case 'Intermediate':
        return 1;
      case 'Advanced':
        return 2;
      default:
        return 0;
    }
  };

  // Helper function to convert language string to enum number
  const languageToEnum = (language: string): number => {
    switch (language) {
      case 'Vi':
        return 0;
      case 'En':
        return 1;
      default:
        return 0;
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      // Convert level and language from string to enum number for backend
      const updateData: any = {
        ...editFormData,
        level: editFormData.level && typeof editFormData.level === 'string' 
          ? levelToEnum(editFormData.level) 
          : editFormData.level,
        language: editFormData.language && typeof editFormData.language === 'string' 
          ? languageToEnum(editFormData.language) 
          : editFormData.language,
      };
      
      await courseService.update(selectedCourse.id, updateData);
      setShowEditModal(false);
      setSelectedCourse(null);
      showToast('Course updated successfully!', 'success');
      fetchCourses();
    } catch (error: any) {
      console.error('Failed to update course:', error);
      showToast(error.response?.data?.message || 'Failed to update course', 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setCourseToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    try {
      await courseService.delete(courseToDelete);
      showToast('Course deleted successfully!', 'success');
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (error: any) {
      console.error('Failed to delete course:', error);
      showToast(error.response?.data?.message || 'Failed to delete course', 'error');
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await courseService.restore(id);
      showToast('Course restored successfully!', 'success');
      fetchCourses();
    } catch (error: any) {
      console.error('Failed to restore course:', error);
      showToast(error.response?.data?.message || 'Failed to restore course', 'error');
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await courseService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedCourse(data);
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error('Failed to fetch course details:', error);
      alert('Failed to fetch course details');
    }
  };

  // Helper function to populate edit form from course data
  const populateEditForm = (course: CourseDetailsDto | CourseDto) => {
    // Convert level from number/enum to string format
    let levelValue: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    if (course.level !== undefined && course.level !== null) {
      const levelStr = formatLevel(course.level);
      if (levelStr === 'Beginner' || levelStr === 'Intermediate' || levelStr === 'Advanced') {
        levelValue = levelStr;
      }
    }

    // Convert language from number/enum to string format  
    let languageValue: 'Vi' | 'En' = 'Vi';
    if (course.language !== undefined && course.language !== null) {
      const langStr = formatLanguage(course.language);
      languageValue = langStr === 'Vietnamese' ? 'Vi' : 'En';
    }

    setEditFormData({
      title: course.title || '',
      description: course.description || '',
      price: course.price || 0,
      categoryId: course.categoryId,
      level: levelValue,
      language: languageValue,
      isPublished: course.isPublished ?? false,
      discountPercent: 'discountPercent' in course ? course.discountPercent : undefined,
      finalPrice: course.finalPrice,
      discountExpiresAt: 'discountExpiresAt' in course ? course.discountExpiresAt : undefined,
    });
  };

  const handleEditClick = async (course: CourseDto) => {
    try {
      const response = await courseService.getById(course.id);
      const data = response.data?.data || response.data;
      setSelectedCourse(data);
      populateEditForm(data);
      setShowEditModal(true);
    } catch (error: any) {
      console.error('Failed to fetch course:', error);
      alert('Failed to fetch course');
    }
  };

  const handleIndexCoursesClick = () => {
    setShowIndexModal(true);
  };

  const handleIndexCoursesConfirm = async () => {
    try {
      await courseService.indexCourses();
      showToast('Courses indexed successfully!', 'success');
      setShowIndexModal(false);
    } catch (error: any) {
      console.error('Failed to index courses:', error);
      showToast(error.response?.data?.message || 'Failed to index courses', 'error');
      setShowIndexModal(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: '',
      createdFrom: '',
      createdTo: '',
      level: '',
      language: '',
      isPublished: '',
      sortBy: 'createdAt',
      isDescending: true,
    });
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'None';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  // Helper functions to format enum values
  const formatLevel = (level: number | string | undefined): string => {
    if (level === undefined || level === null) return 'N/A';
    // Handle both number and string formats
    const levelValue = typeof level === 'number' ? level : parseInt(String(level));
    switch (levelValue) {
      case 0:
        return 'Beginner';
      case 1:
        return 'Intermediate';
      case 2:
        return 'Advanced';
      default:
        // If it's already a string like "Beginner", return as is
        return typeof level === 'string' ? level : 'Unknown';
    }
  };

  const formatLanguage = (language: number | string | undefined): string => {
    if (language === undefined || language === null) return 'N/A';
    // Handle both number and string formats
    const langValue = typeof language === 'number' ? language : parseInt(String(language));
    switch (langValue) {
      case 0:
        return 'Vietnamese';
      case 1:
        return 'English';
      default:
        // If it's already a string like "Vi" or "En", format it
        if (typeof language === 'string') {
          return language.toLowerCase() === 'vi' ? 'Vietnamese' : 
                 language.toLowerCase() === 'en' ? 'English' : language;
        }
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Courses Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize your courses
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleIndexCoursesClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Re-index all courses"
          >
            <Download className="w-5 h-5" />
            Index
          </button>
          <button
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                price: 0,
                durationInMinutes: 0,
                categoryId: undefined,
                level: 'Beginner',
                language: 'Vi',
                isPublished: false,
              });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Course
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => {
            setViewMode('all');
            setPage(1);
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'all'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Courses
        </button>
        <button
          onClick={() => {
            setViewMode('deleted');
            setPage(1);
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'deleted'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Deleted
        </button>
      </div>

      {/* Search and Filters */}
      <div ref={filterSectionRef} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border rounded-lg transition-colors ${
              showFilters
                ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-950/50 dark:border-indigo-700'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={fetchCourses}
            disabled={isFiltering}
            className={`p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
              isFiltering ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isFiltering ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Level
              </label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Languages</option>
                <option value="Vi">Vietnamese</option>
                <option value="En">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Published Status
              </label>
              <select
                value={filters.isPublished}
                onChange={(e) => setFilters({ ...filters, isPublished: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="999999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="durationInMinutes">Duration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Min Duration (minutes)
              </label>
              <input
                type="number"
                value={filters.minDuration}
                onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Max Duration (minutes)
              </label>
              <input
                type="number"
                value={filters.maxDuration}
                onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Created From
              </label>
              <input
                type="date"
                value={filters.createdFrom}
                onChange={(e) => setFilters({ ...filters, createdFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Created To
              </label>
              <input
                type="date"
                value={filters.createdTo}
                onChange={(e) => setFilters({ ...filters, createdTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.isDescending}
                  onChange={(e) =>
                    setFilters({ ...filters, isDescending: e.target.checked })
                  }
                  className="rounded border-gray-300 dark:border-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Descending
                </span>
              </label>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Courses Table */}
      <div 
        ref={tableRef}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative"
      >
        {/* Loading Overlay */}
        {isFiltering && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Filtering courses...</p>
            </div>
          </div>
        )}

        {loading && !isFiltering ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading courses...</p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No courses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      isFiltering ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {course.courseCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-md">
                        <div className="font-medium">{course.title}</div>
                        {course.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {course.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getCategoryName(course.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        {course.finalPrice && course.finalPrice < course.price ? (
                          <>
                            <span className="line-through text-gray-400">
                              ${course.price}
                            </span>
                            <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                              ${course.finalPrice}
                            </span>
                          </>
                        ) : (
                          <span>${course.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDuration(course.durationInMinutes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatLevel(course.level)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.isPublished
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(course.id)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {viewMode !== 'deleted' && (
                          <>
                            <button
                              onClick={() => handleEditClick(course)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(course.id)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {viewMode === 'deleted' && (
                          <button
                            onClick={() => handleRestore(course.id)}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-lg transition-colors"
                            title="Restore"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && courses.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={courses.length < pageSize}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Course
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.durationInMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationInMinutes: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">None</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Level *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Language *
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        language: e.target.value as 'Vi' | 'En',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Vi">Vietnamese</option>
                    <option value="En">English</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({ ...formData, isPublished: e.target.checked })
                      }
                      className="rounded border-gray-300 dark:border-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Published
                    </span>
                  </label>
                </div>
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
      {showEditModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Course
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCourse(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Description *
                  </label>
                  <textarea
                    required
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={editFormData.categoryId || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        categoryId: e.target.value || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">None</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Level
                  </label>
                  <select
                    value={editFormData.level || 'Beginner'}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Language
                  </label>
                  <select
                    value={editFormData.language || 'Vi'}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        language: e.target.value as 'Vi' | 'En',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Vi">Vietnamese</option>
                    <option value="En">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Discount Percent
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editFormData.discountPercent || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        discountPercent: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Final Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editFormData.finalPrice || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        finalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Discount Expires At
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      editFormData.discountExpiresAt
                        ? new Date(editFormData.discountExpiresAt)
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        discountExpiresAt: e.target.value || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editFormData.isPublished || false}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isPublished: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 dark:border-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Published
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCourse(null);
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
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Course Details
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCourse(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedCourse.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Code: {selectedCourse.courseCode}
                </p>
                {selectedCourse.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedCourse.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="text-gray-900 dark:text-white">
                    {selectedCourse.categoryName || 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-gray-900 dark:text-white">
                    {selectedCourse.finalPrice &&
                    selectedCourse.finalPrice < selectedCourse.price ? (
                      <>
                        <span className="line-through text-gray-400">
                          ${selectedCourse.price}
                        </span>
                        <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                          ${selectedCourse.finalPrice}
                        </span>
                        {selectedCourse.discountPercent && (
                          <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                            ({selectedCourse.discountPercent}% off)
                          </span>
                        )}
                      </>
                    ) : (
                      `$${selectedCourse.price}`
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDuration(selectedCourse.durationInMinutes)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                  <p className="text-gray-900 dark:text-white">{formatLevel(selectedCourse.level)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
                  <p className="text-gray-900 dark:text-white">{formatLanguage(selectedCourse.language)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedCourse.isPublished
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {selectedCourse.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedCourse.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedCourse.updatedAt && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedCourse.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    if (selectedCourse) {
                      populateEditForm(selectedCourse);
                    }
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
                    setSelectedCourse(null);
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Course
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Index Confirmation Modal */}
      {showIndexModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Re-index Courses
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This will re-index all courses to Elasticsearch. This process may take a few moments.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowIndexModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleIndexCoursesConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
