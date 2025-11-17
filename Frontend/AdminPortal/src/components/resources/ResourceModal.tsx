import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CreateResourceDto, UpdateResourceDto, ResourceDetailsDto, LectureDto } from '../../services/adminService';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateResourceDto | UpdateResourceDto) => Promise<void>;
  resource?: ResourceDetailsDto | null;
  lectures: LectureDto[];
  loading?: boolean;
}

export default function ResourceModal({
  isOpen,
  onClose,
  onSubmit,
  resource,
  lectures,
  loading = false,
}: ResourceModalProps) {
  const [formData, setFormData] = useState<CreateResourceDto>({
    lectureId: resource?.lectureId || '',
    fileName: resource?.fileName || '',
    fileUrl: resource?.fileUrl || '',
    resourceType: resource?.resourceType || 'Pdf',
    fileSizeKB: resource?.fileSizeKB,
  });

  useEffect(() => {
    if (resource) {
      setFormData({
        lectureId: resource.lectureId,
        fileName: resource.fileName,
        fileUrl: resource.fileUrl,
        resourceType: resource.resourceType,
        fileSizeKB: resource.fileSizeKB,
      });
    } else {
      setFormData({
        lectureId: '',
        fileName: '',
        fileUrl: '',
        resourceType: 'Pdf',
        fileSizeKB: undefined,
      });
    }
  }, [resource, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {resource ? 'Edit Resource' : 'Create Resource'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lecture *
            </label>
            <select
              value={formData.lectureId}
              onChange={(e) => setFormData({ ...formData, lectureId: e.target.value })}
              required
              disabled={!!resource}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">Select Lecture</option>
              {lectures.map((lecture) => (
                <option key={lecture.id} value={lecture.id}>
                  {lecture.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              File Name *
            </label>
            <input
              type="text"
              value={formData.fileName}
              onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              File URL *
            </label>
            <input
              type="url"
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resource Type *
              </label>
              <select
                value={formData.resourceType}
                onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="Pdf">PDF</option>
                <option value="Zip">ZIP</option>
                <option value="Code">Code</option>
                <option value="Image">Image</option>
                <option value="Link">Link</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File Size (KB)
              </label>
              <input
                type="number"
                value={formData.fileSizeKB || ''}
                onChange={(e) => setFormData({ ...formData, fileSizeKB: parseInt(e.target.value) || undefined })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {resource ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

