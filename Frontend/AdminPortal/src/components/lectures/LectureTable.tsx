import { Edit, Trash2, Eye, FolderTree, Loader2, FileEdit } from 'lucide-react';
import { LectureDto, SectionDto } from '../../services/adminService';
import TableLoading from '../ui/TableLoading';
import { Video } from 'lucide-react';

interface LectureTableProps {
  lectures: LectureDto[];
  sections: SectionDto[];
  loading: boolean;
  isFiltering: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewResources?: (lectureId: string) => void;
  onEditContent?: (lectureId: string) => void;
}

export default function LectureTable({
  lectures,
  sections,
  loading,
  isFiltering,
  onView,
  onEdit,
  onDelete,
  onViewResources,
  onEditContent,
}: LectureTableProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatType = (type: string) => {
    switch (type) {
      case '0':
      case 'Video':
        return 'Video';
      case '1':
      case 'Text':
        return 'Text';
      case '2':
      case 'Quiz':
        return 'Quiz';
      case '3':
      case 'Assignment':
        return 'Assignment';
      default:
        return type;
    }
  };

  const getSectionTitle = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    return section?.title || sectionId.substring(0, 8) + '...';
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
              Filtering lectures...
            </p>
          </div>
        </div>
      )}

      <div className={isFiltering ? 'opacity-50 pointer-events-none' : ''}>
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resources
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Preview
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
              skeletonColumns={7}
            />
          ) : lectures.length === 0 ? (
            <TableLoading
              loading={false}
              isEmpty={true}
              emptyMessage="No lectures found"
              emptyIcon={Video}
              skeletonColumns={7}
            />
          ) : (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {lectures.map((lecture) => (
            <tr key={lecture.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {lecture.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Order: {lecture.orderIndex}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {getSectionTitle(lecture.sectionId)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {lecture.sectionId.substring(0, 8)}...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {formatType(lecture.type)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDuration(lecture.duration)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {onViewResources ? (
                  <button
                    onClick={() => onViewResources(lecture.id)}
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    title="View Resources"
                  >
                    <FolderTree className="w-4 h-4" />
                    <span className="text-sm font-medium">{lecture.resourcesCount || 0}</span>
                  </button>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {lecture.resourcesCount || 0}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {lecture.isPreviewable ? (
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Yes
                  </span>
                ) : (
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    No
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(lecture.id)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {onEditContent && (
                    <button
                      onClick={() => onEditContent(lecture.id)}
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      title="Edit Content"
                    >
                      <FileEdit className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(lecture.id)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lecture.id)}
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