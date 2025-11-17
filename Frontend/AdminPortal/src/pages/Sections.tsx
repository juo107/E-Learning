import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  sectionService,
  SectionDto,
  SectionDetailsDto,
  CreateSectionDto,
  UpdateSectionDto,
} from '../services/adminService';
import { courseService, CourseDto } from '../services/adminService';
import { showToast } from '../components/ui/Toast';
import SectionFilters from '../components/sections/SectionFilters';
import SectionTable from '../components/sections/SectionTable';
import SectionModal from '../components/sections/SectionModal';
import SectionDetailsModal from '../components/sections/SectionDetailsModal';

export default function Sections() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<SectionDetailsDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageSize = 10;

  // Read courseId from URL query params
  useEffect(() => {
    const courseIdFromUrl = searchParams.get('courseId');
    if (courseIdFromUrl) {
      setSelectedCourseId(courseIdFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    setIsFiltering(true);
    filterTimeoutRef.current = setTimeout(() => {
      fetchSections();
    }, 300);
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [page, searchTerm, selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAll({ pageSize: 1000 });
      const data = response.data?.data || response.data || [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchSections = async () => {
    setLoading(true);
    setIsFiltering(true);
    try {
      const params: any = {
        pageNumber: page,
        pageSize,
        keyword: searchTerm || undefined,
        sortBy: 'orderIndex',
        isDescending: false,
      };

      let response;
      if (selectedCourseId) {
        response = await sectionService.getByCourseId(selectedCourseId);
      } else {
        response = await sectionService.getAll(params);
      }

      const data = response.data?.data || response.data || [];
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      showToast('Failed to fetch sections', 'error');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  const handleCreate = async (data: CreateSectionDto | UpdateSectionDto) => {
    setModalLoading(true);
    try {
      await sectionService.create(data as CreateSectionDto);
      showToast('Section created successfully!', 'success');
      setShowCreateModal(false);
      fetchSections();
    } catch (error: any) {
      console.error('Failed to create section:', error);
      showToast(error.response?.data?.message || 'Failed to create section', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = async (data: CreateSectionDto | UpdateSectionDto) => {
    if (!selectedSection) return;
    setModalLoading(true);
    try {
      await sectionService.update(selectedSection.id, data as UpdateSectionDto);
      showToast('Section updated successfully!', 'success');
      setShowEditModal(false);
      setSelectedSection(null);
      fetchSections();
    } catch (error: any) {
      console.error('Failed to update section:', error);
      showToast(error.response?.data?.message || 'Failed to update section', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await sectionService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedSection(data);
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error('Failed to fetch section details:', error);
      showToast('Failed to fetch section details', 'error');
    }
  };

  const handleEditClick = async (id: string) => {
    try {
      const response = await sectionService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedSection(data);
      setShowEditModal(true);
    } catch (error: any) {
      console.error('Failed to fetch section:', error);
      showToast('Failed to fetch section', 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setSectionToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sectionToDelete) return;
    try {
      await sectionService.delete(sectionToDelete);
      showToast('Section deleted successfully!', 'success');
      setShowDeleteModal(false);
      setSectionToDelete(null);
      fetchSections();
    } catch (error: any) {
      console.error('Failed to delete section:', error);
      showToast(error.response?.data?.message || 'Failed to delete section', 'error');
      setShowDeleteModal(false);
      setSectionToDelete(null);
    }
  };

  const handleViewLectures = (sectionId: string) => {
    navigate(`/lectures?sectionId=${sectionId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sections</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage course sections</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Section
        </button>
      </div>

      {/* Filters */}
      <SectionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCourseId={selectedCourseId}
        onCourseChange={(courseId) => {
          setSelectedCourseId(courseId);
          // Update URL query params
          if (courseId) {
            setSearchParams({ courseId });
          } else {
            setSearchParams({});
          }
        }}
        courses={courses}
      />

      {/* Sections Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        <SectionTable
          sections={sections}
          courses={courses}
          loading={loading}
          isFiltering={isFiltering}
          onView={handleViewDetails}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onViewLectures={handleViewLectures}
        />
      </div>

      {/* Pagination */}
      {!loading && sections.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-700 dark:text-gray-300">Page {page}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={sections.length < pageSize}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <SectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        courses={courses}
        loading={modalLoading}
      />

      {/* Edit Modal */}
      <SectionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSection(null);
        }}
        onSubmit={handleEdit}
        section={selectedSection}
        courses={courses}
        loading={modalLoading}
      />

      {/* Details Modal */}
      <SectionDetailsModal
        section={selectedSection}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSection(null);
        }}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Section</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this section? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSectionToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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

