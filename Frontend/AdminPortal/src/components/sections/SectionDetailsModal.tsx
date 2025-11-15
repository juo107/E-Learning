import { X } from 'lucide-react';
import { SectionDetailsDto } from '../../services/adminService';

interface SectionDetailsModalProps {
  section: SectionDetailsDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SectionDetailsModal({
  section,
  isOpen,
  onClose,
}: SectionDetailsModalProps) {
  if (!isOpen || !section) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Section Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <p className="text-gray-900 dark:text-white">{section.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course
              </label>
              <p className="text-gray-900 dark:text-white">{section.courseTitle || section.courseId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order Index
              </label>
              <p className="text-gray-900 dark:text-white">{section.orderIndex}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Is Previewable
              </label>
              <p className="text-gray-900 dark:text-white">
                {section.isPreviewable ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lectures Count
              </label>
              <p className="text-gray-900 dark:text-white">{section.lecturesCount}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Created At
              </label>
              <p className="text-gray-900 dark:text-white">{formatDate(section.createdAt)}</p>
            </div>
          </div>
          {section.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <p className="text-gray-900 dark:text-white">{section.description}</p>
            </div>
          )}
          {section.lectures && section.lectures.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lectures ({section.lectures.length})
              </label>
              <div className="space-y-2">
                {section.lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{lecture.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {lecture.type} • Order: {lecture.orderIndex}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {lecture.resourcesCount} resources
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

