import { CheckCircle2, XCircle, AlertCircle, Image, Video, Download } from 'lucide-react';
import { CourseDetailsDto } from '../../services/adminService';

interface MediaModerationPanelProps {
  course: CourseDetailsDto;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: (notes: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function MediaModerationPanel({
  course,
  onApprove,
  onReject,
  onRequestChanges,
  notes,
  onNotesChange,
}: MediaModerationPanelProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Media</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Media Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          {course.thumbnailUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Thumbnail Image
              </h3>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={course.thumbnailUrl}
                  alt="Course thumbnail"
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={course.thumbnailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          )}

          {/* Primary Image */}
          {course.primaryImageUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Primary Image
              </h3>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={course.primaryImageUrl}
                  alt="Course primary image"
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={course.primaryImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          )}

          {/* Preview Video */}
          {course.promoVideoUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preview Video
              </h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={course.promoVideoUrl}
                  controls
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={course.promoVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Moderation Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add your moderation notes here..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
            />
          </div>
        </div>

        {/* Right Column - Metadata & Actions */}
        <div className="space-y-6">
          {/* Media Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Media Information
            </h3>
            <div className="space-y-4">
              {course.thumbnailUrl && (
                <div className="flex items-center gap-3">
                  <Image className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Thumbnail</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Available</p>
                  </div>
                </div>
              )}

              {course.primaryImageUrl && (
                <div className="flex items-center gap-3">
                  <Image className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Primary Image</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Available</p>
                  </div>
                </div>
              )}

              {course.promoVideoUrl && (
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Preview Video</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={onApprove}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Media
              </button>
              <button
                onClick={() => {
                  if (notes.trim()) {
                    onRequestChanges(notes);
                  } else {
                    alert('Please add notes before requesting changes');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                Request Changes
              </button>
              <button
                onClick={onReject}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject Media
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

