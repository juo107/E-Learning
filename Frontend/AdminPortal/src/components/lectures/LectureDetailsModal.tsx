import { X, Video, FileText, HelpCircle, BookOpen } from 'lucide-react';
import { LectureDetailsDto } from '../../services/adminService';

interface LectureDetailsModalProps {
  lecture: LectureDetailsDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LectureDetailsModal({
  lecture,
  isOpen,
  onClose,
}: LectureDetailsModalProps) {
  if (!isOpen || !lecture) return null;

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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '0':
      case 'Video':
        return <Video className="w-5 h-5 text-indigo-600" />;
      case '1':
      case 'Text':
        return <FileText className="w-5 h-5 text-green-600" />;
      case '2':
      case 'Quiz':
        return <HelpCircle className="w-5 h-5 text-yellow-600" />;
      case '3':
      case 'Assignment':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lecture Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getTypeIcon(lecture.type)}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lecture.title}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Section: {lecture.sectionTitle || lecture.sectionId.substring(0, 8) + '...'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-gray-900 dark:text-white font-medium">{formatType(lecture.type)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-gray-900 dark:text-white font-medium">{formatDuration(lecture.duration)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Order Index</p>
              <p className="text-gray-900 dark:text-white font-medium">{lecture.orderIndex}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Previewable</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {lecture.isPreviewable ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Resources Count</p>
              <p className="text-gray-900 dark:text-white font-medium">{lecture.resourcesCount || 0}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Created At</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(lecture.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {lecture.videoUrl && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Video URL</p>
              <a
                href={lecture.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
              >
                {lecture.videoUrl}
              </a>
            </div>
          )}

          {lecture.content && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Content</p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                  {lecture.content}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

