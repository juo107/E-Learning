import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  lectureService,
  LectureDto,
  LectureDetailsDto,
  CreateLectureDto,
  UpdateLectureDto,
} from '../services/adminService';
import { sectionService, SectionDto } from '../services/adminService';
import { showToast } from '../components/ui/Toast';
import LectureFilters from '../components/lectures/LectureFilters';
import LectureTable from '../components/lectures/LectureTable';
import LectureModal from '../components/lectures/LectureModal';
import LectureDetailsModal from '../components/lectures/LectureDetailsModal';

export default function Lectures() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lectures, setLectures] = useState<LectureDto[]>([]);
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedLecture, setSelectedLecture] = useState<LectureDetailsDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageSize = 10;

  // Read sectionId from URL query params
  useEffect(() => {
    const sectionIdFromUrl = searchParams.get('sectionId');
    if (sectionIdFromUrl) {
      setSelectedSectionId(sectionIdFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    setIsFiltering(true);
    filterTimeoutRef.current = setTimeout(() => {
      fetchLectures();
    }, 300);
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [page, searchTerm, selectedSectionId]);

  const fetchSections = async () => {
    try {
      const response = await sectionService.getAll({ pageSize: 1000 });
      const data = response.data?.data || response.data || [];
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    }
  };

  const fetchLectures = async () => {
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
      if (selectedSectionId) {
        response = await lectureService.getBySectionId(selectedSectionId);
      } else {
        response = await lectureService.getAll(params);
      }

      const data = response.data?.data || response.data || [];
      setLectures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch lectures:', error);
      showToast('Failed to fetch lectures', 'error');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  const handleCreate = async (data: CreateLectureDto | UpdateLectureDto) => {
    setModalLoading(true);
    try {
      await lectureService.create(data as CreateLectureDto);
      showToast('Lecture created successfully!', 'success');
      setShowCreateModal(false);
      fetchLectures();
    } catch (error: any) {
      console.error('Failed to create lecture:', error);
      showToast(error.response?.data?.message || 'Failed to create lecture', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = async (data: CreateLectureDto | UpdateLectureDto) => {
    if (!selectedLecture) return;
    setModalLoading(true);
    try {
      await lectureService.update(selectedLecture.id, data as UpdateLectureDto);
      showToast('Lecture updated successfully!', 'success');
      setShowEditModal(false);
      setSelectedLecture(null);
      fetchLectures();
    } catch (error: any) {
      console.error('Failed to update lecture:', error);
      showToast(error.response?.data?.message || 'Failed to update lecture', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await lectureService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedLecture(data);
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error('Failed to fetch lecture details:', error);
      showToast('Failed to fetch lecture details', 'error');
    }
  };

  const handleEditClick = async (id: string) => {
    try {
      const response = await lectureService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedLecture(data);
      setShowEditModal(true);
    } catch (error: any) {
      console.error('Failed to fetch lecture:', error);
      showToast('Failed to fetch lecture', 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setLectureToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!lectureToDelete) return;
    try {
      await lectureService.delete(lectureToDelete);
      showToast('Lecture deleted successfully!', 'success');
      setShowDeleteModal(false);
      setLectureToDelete(null);
      fetchLectures();
    } catch (error: any) {
      console.error('Failed to delete lecture:', error);
      showToast(error.response?.data?.message || 'Failed to delete lecture', 'error');
      setShowDeleteModal(false);
      setLectureToDelete(null);
    }
  };

  const handleViewResources = (lectureId: string) => {
    navigate(`/resources?lectureId=${lectureId}`);
  };

  const handleEditContent = (lectureId: string) => {
    // Open editor in new tab
    window.open(`/courses/editor?lectureId=${lectureId}`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lectures</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage course lectures</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Lecture
        </button>
      </div>

      {/* Filters */}
      <LectureFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSectionId={selectedSectionId}
        onSectionChange={(sectionId) => {
          setSelectedSectionId(sectionId);
          if (sectionId) {
            setSearchParams({ sectionId });
          } else {
            setSearchParams({});
          }
        }}
        sections={sections}
      />

      {/* Lectures Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        <LectureTable
          lectures={lectures}
          sections={sections}
          loading={loading}
          isFiltering={isFiltering}
          onView={handleViewDetails}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onViewResources={handleViewResources}
          onEditContent={handleEditContent}
        />
      </div>

      {/* Pagination */}
      {!loading && lectures.length > 0 && (
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
              disabled={lectures.length < pageSize}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <LectureModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        sections={sections}
        loading={modalLoading}
      />

      {/* Edit Modal */}
      <LectureModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLecture(null);
        }}
        onSubmit={handleEdit}
        lecture={selectedLecture}
        sections={sections}
        loading={modalLoading}
      />

      {/* Details Modal */}
      <LectureDetailsModal
        lecture={selectedLecture}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedLecture(null);
        }}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Lecture</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this lecture? This action cannot be undone.
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
                    setLectureToDelete(null);
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

