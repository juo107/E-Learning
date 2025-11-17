import { Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { ResourceDto, LectureDto } from '../../services/adminService';
import TableLoading from '../ui/TableLoading';
import { FileText } from 'lucide-react';

interface ResourceTableProps {
  resources: ResourceDto[];
  lectures: LectureDto[];
  loading: boolean;
  isFiltering: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ResourceTable({
  resources,
  lectures,
  loading,
  isFiltering,
  onView,
  onEdit,
  onDelete,
}: ResourceTableProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (kb?: number) => {
    if (!kb) return 'N/A';
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

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

  const getLectureTitle = (lectureId: string) => {
    const lecture = lectures.find(l => l.id === lectureId);
    return lecture?.title || lectureId.substring(0, 8) + '...';
  };

  return (
    <div className="overflow-x-auto relative">
      {/* Filtering Overlay */}
      {isFiltering && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              <div className="absolute inset-0 bg-indigo-600/20 dark:bg-indigo-400/20 rounded-full blur-lg animate-pulse" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
              Filtering resources...
            </p>
          </div>
        </div>
      )}

      <div className={isFiltering ? 'opacity-50 pointer-events-none' : ''}>
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                File Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Lecture
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          {loading && !isFiltering ? (
            <TableLoading
              loading={loading}
              isEmpty={false}
              skeletonRows={5}
              skeletonColumns={6}
            />
          ) : resources.length === 0 ? (
            <TableLoading
              loading={false}
              isEmpty={true}
              emptyMessage="No resources found"
              emptyIcon={FileText}
              skeletonColumns={6}
            />
          ) : (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {resources.map((resource) => (
            <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {resource.fileName}
                </div>
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-xs block"
                >
                  {resource.fileUrl}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {getLectureTitle(resource.lectureId)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {resource.lectureId.substring(0, 8)}...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  {formatType(resource.resourceType)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(resource.fileSizeKB)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(resource.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(resource.id)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(resource.id)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(resource.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

