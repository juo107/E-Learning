import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  resourceService,
  ResourceDto,
  ResourceDetailsDto,
  CreateResourceDto,
  UpdateResourceDto,
} from '../services/adminService';
import { lectureService, LectureDto } from '../services/adminService';
import { showToast } from '../components/ui/Toast';
import ResourceFilters from '../components/resources/ResourceFilters';
import ResourceTable from '../components/resources/ResourceTable';
import ResourceModal from '../components/resources/ResourceModal';
import ResourceDetailsModal from '../components/resources/ResourceDetailsModal';

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<ResourceDto[]>([]);
  const [lectures, setLectures] = useState<LectureDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLectureId, setSelectedLectureId] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<ResourceDetailsDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageSize = 10;

  // Read lectureId from URL query params
  useEffect(() => {
    const lectureIdFromUrl = searchParams.get('lectureId');
    if (lectureIdFromUrl) {
      setSelectedLectureId(lectureIdFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchLectures();
  }, []);

  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    setIsFiltering(true);
    filterTimeoutRef.current = setTimeout(() => {
      fetchResources();
    }, 300);
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [page, searchTerm, selectedLectureId]);

  const fetchLectures = async () => {
    try {
      const response = await lectureService.getAll({ pageSize: 1000 });
      const data = response.data?.data || response.data || [];
      setLectures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch lectures:', error);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    setIsFiltering(true);
    try {
      const params: any = {
        pageNumber: page,
        pageSize,
        keyword: searchTerm || undefined,
        sortBy: 'createdAt',
        isDescending: true,
      };

      let response;
      if (selectedLectureId) {
        response = await resourceService.getByLectureId(selectedLectureId);
      } else {
        response = await resourceService.getAll(params);
      }

      const data = response.data?.data || response.data || [];
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      showToast('Failed to fetch resources', 'error');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  const handleCreate = async (data: CreateResourceDto | UpdateResourceDto) => {
    setModalLoading(true);
    try {
      await resourceService.create(data as CreateResourceDto);
      showToast('Resource created successfully!', 'success');
      setShowCreateModal(false);
      fetchResources();
    } catch (error: any) {
      console.error('Failed to create resource:', error);
      showToast(error.response?.data?.message || 'Failed to create resource', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = async (data: CreateResourceDto | UpdateResourceDto) => {
    if (!selectedResource) return;
    setModalLoading(true);
    try {
      await resourceService.update(selectedResource.id, data as UpdateResourceDto);
      showToast('Resource updated successfully!', 'success');
      setShowEditModal(false);
      setSelectedResource(null);
      fetchResources();
    } catch (error: any) {
      console.error('Failed to update resource:', error);
      showToast(error.response?.data?.message || 'Failed to update resource', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await resourceService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedResource(data);
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error('Failed to fetch resource details:', error);
      showToast('Failed to fetch resource details', 'error');
    }
  };

  const handleEditClick = async (id: string) => {
    try {
      const response = await resourceService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedResource(data);
      setShowEditModal(true);
    } catch (error: any) {
      console.error('Failed to fetch resource:', error);
      showToast('Failed to fetch resource', 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setResourceToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resourceToDelete) return;
    try {
      await resourceService.delete(resourceToDelete);
      showToast('Resource deleted successfully!', 'success');
      setShowDeleteModal(false);
      setResourceToDelete(null);
      fetchResources();
    } catch (error: any) {
      console.error('Failed to delete resource:', error);
      showToast(error.response?.data?.message || 'Failed to delete resource', 'error');
      setShowDeleteModal(false);
      setResourceToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resources</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage lecture resources</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Resource
        </button>
      </div>

      {/* Filters */}
      <ResourceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedLectureId={selectedLectureId}
        onLectureChange={(lectureId) => {
          setSelectedLectureId(lectureId);
          if (lectureId) {
            setSearchParams({ lectureId });
          } else {
            setSearchParams({});
          }
        }}
        lectures={lectures}
      />

      {/* Resources Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        <ResourceTable
          resources={resources}
          lectures={lectures}
          loading={loading}
          isFiltering={isFiltering}
          onView={handleViewDetails}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Pagination */}
      {!loading && resources.length > 0 && (
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
              disabled={resources.length < pageSize}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <ResourceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        lectures={lectures}
        loading={modalLoading}
      />

      {/* Edit Modal */}
      <ResourceModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedResource(null);
        }}
        onSubmit={handleEdit}
        resource={selectedResource}
        lectures={lectures}
        loading={modalLoading}
      />

      {/* Details Modal */}
      <ResourceDetailsModal
        resource={selectedResource}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedResource(null);
        }}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Resource</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this resource? This action cannot be undone.
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
                    setResourceToDelete(null);
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

