import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { LectureDto } from '../../services/adminService';

interface EditorHeaderProps {
  lecture: LectureDto;
  saving: boolean;
  saved: boolean;
  onBack: () => void;
}

export default function EditorHeader({ lecture, saving, saved, onBack }: EditorHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Back button and Lecture title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to curriculum"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{lecture.title}</h1>
            <p className="text-sm text-gray-500">Content Editor</p>
          </div>
        </div>

        {/* Right: Save status */}
        <div className="flex items-center gap-3">
          {saving ? (
            <div className="flex items-center gap-2 text-yellow-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Saving...</span>
            </div>
          ) : saved ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Saved</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Save className="w-4 h-4" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

