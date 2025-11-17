import { CheckCircle2, XCircle, AlertCircle, BookOpen, Video, Clock } from 'lucide-react';
import { SectionDto } from '../../services/adminService';
import { CourseDetailsDto } from '../../services/adminService';
import { LectureDto } from '../../services/adminService';

interface SectionModerationPanelProps {
  section: SectionDto;
  course: CourseDetailsDto;
  lectures: LectureDto[];
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: (notes: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function SectionModerationPanel({
  section,
  course,
  lectures,
  onApprove,
  onReject,
  onRequestChanges,
  notes,
  onNotesChange,
}: SectionModerationPanelProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const totalDuration = lectures.reduce((sum, lecture) => sum + (lecture.duration || 0), 0);
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Section {section.orderIndex} of course: {course.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              section.isPreviewable
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {section.isPreviewable ? 'Previewable' : 'Not Previewable'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {section.description || 'No description provided'}
            </p>
          </div>

          {/* Lectures List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lectures ({lectures.length})
            </h3>
            <div className="space-y-3">
              {lectures.map((lecture, index) => (
                <div
                  key={lecture.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {lecture.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {lecture.type} {lecture.duration && `• ${formatDuration(lecture.duration)}`}
                      </p>
                    </div>
                  </div>
                  {lecture.isPreviewable && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                      Preview
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

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
          {/* Section Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Section Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order Index</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {section.orderIndex}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lectures</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {lectures.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Duration</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDuration(totalDuration)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dates</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(section.createdAt)}
                </p>
              </div>
              {section.updatedAt && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(section.updatedAt)}
                  </p>
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
                Approve Section
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
                Reject Section
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

