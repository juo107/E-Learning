import { CheckCircle2, XCircle, AlertCircle, Save, FileText } from 'lucide-react';
import { CourseDetailsDto } from '../../services/adminService';

interface ModerationActionBarProps {
  course: CourseDetailsDto;
  onApproveAll: () => void;
  onReject: () => void;
  onRequestChanges: (notes: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function ModerationActionBar({
  course,
  onApproveAll,
  onReject,
  onRequestChanges,
  notes,
  onNotesChange,
}: ModerationActionBarProps) {
  const handleRequestChanges = () => {
    if (notes.trim()) {
      onRequestChanges(notes);
    } else {
      alert('Please add notes before requesting changes');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Course Info */}
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Course Code: {course.courseCode}
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                course.isPublished
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}
            >
              {course.isPublished ? 'Published' : 'Pending Moderation'}
            </span>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Notes Input */}
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add notes..."
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRequestChanges}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-lg transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            Request Changes
          </button>

          <button
            onClick={onReject}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>

          <button
            onClick={onApproveAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve All
          </button>
        </div>
      </div>
    </div>
  );
}

