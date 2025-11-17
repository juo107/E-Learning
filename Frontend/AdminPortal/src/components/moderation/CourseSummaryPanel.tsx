import { CheckCircle2, XCircle, AlertCircle, Clock, DollarSign, Tag, BookOpen } from 'lucide-react';
import { CourseDetailsDto } from '../../services/adminService';
import { SectionDto } from '../../services/adminService';
import { LectureDto } from '../../services/adminService';
import ModerationChecklist from './ModerationChecklist';

interface CourseSummaryPanelProps {
  course: CourseDetailsDto;
  sections: SectionDto[];
  lectures: LectureDto[];
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: (notes: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  checklist: Record<string, boolean>;
  onChecklistChange: (checklist: Record<string, boolean>) => void;
}

export default function CourseSummaryPanel({
  course,
  sections,
  lectures,
  onApprove,
  onReject,
  onRequestChanges,
  notes,
  onNotesChange,
  checklist,
  onChecklistChange,
}: CourseSummaryPanelProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Course Code: {course.courseCode}
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Image */}
          {course.thumbnailUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {course.description || 'No description provided'}
            </p>
          </div>

          {/* Video Intro */}
          {course.promoVideoUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
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
          {/* Course Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Course Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.categoryName || 'Uncategorized'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.level || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.durationInMinutes} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPrice(course.finalPrice || course.price)}
                    {course.finalPrice && course.finalPrice < course.price && (
                      <span className="ml-2 text-xs text-gray-500 line-through">
                        {formatPrice(course.price)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Content Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sections</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {sections.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Lectures</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {lectures.length}
                </span>
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
                  {formatDate(course.createdAt)}
                </p>
              </div>
              {course.updatedAt && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(course.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Moderation Checklist */}
          <ModerationChecklist
            checklist={checklist}
            onChecklistChange={onChecklistChange}
          />

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={onApprove}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Course
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
                Reject Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

