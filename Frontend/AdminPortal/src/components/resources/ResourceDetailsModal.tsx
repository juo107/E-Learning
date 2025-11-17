import { X } from 'lucide-react';
import { ResourceDetailsDto } from '../../services/adminService';

interface ResourceDetailsModalProps {
  resource: ResourceDetailsDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceDetailsModal({
  resource,
  isOpen,
  onClose,
}: ResourceDetailsModalProps) {
  if (!isOpen || !resource) return null;

  const formatType = (type: string) => {
    switch (type) {
      case '0':
      case 'Pdf':
        return 'PDF';
      case '1':
      case 'Zip':
        return 'ZIP';
      case '2':
      case 'Code':
        return 'Code';
      case '3':
      case 'Image':
        return 'Image';
      case '4':
      case 'Link':
        return 'Link';
      default:
        return type;
    }
  };

  const formatFileSize = (kb?: number) => {
    if (!kb) return 'N/A';
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resource Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{resource.fileName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Lecture: {resource.lectureTitle || resource.lectureId.substring(0, 8) + '...'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Resource Type</p>
              <p className="text-gray-900 dark:text-white font-medium">{formatType(resource.resourceType)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">File Size</p>
              <p className="text-gray-900 dark:text-white font-medium">{formatFileSize(resource.fileSizeKB)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Created At</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(resource.createdAt).toLocaleString()}
              </p>
            </div>
            {resource.updatedAt && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Updated At</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(resource.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">File URL</p>
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
            >
              {resource.fileUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

