import { useState } from 'react';
import {
  BookOpen,
  FolderTree,
  Video,
  FileText,
  Image,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { CourseDetailsDto } from '../../services/adminService';
import { SectionDto } from '../../services/adminService';
import { LectureDto } from '../../services/adminService';
import { ResourceDto } from '../../services/adminService';
import { SelectedItem, ModerationItemType } from './types';

interface ModerationTreeViewProps {
  course: CourseDetailsDto;
  sections: SectionDto[];
  lectures: LectureDto[];
  resources: ResourceDto[];
  selectedItem: SelectedItem | null;
  onItemSelect: (item: SelectedItem) => void;
}

type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'needs-changes';

interface TreeNodeProps {
  icon: any;
  label: string;
  status?: ModerationStatus;
  isExpanded?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  children?: React.ReactNode;
  badge?: string | number;
}

function TreeNode({
  icon: Icon,
  label,
  status,
  isExpanded,
  onToggle,
  onClick,
  isSelected,
  children,
  badge,
}: TreeNodeProps) {
  const hasChildren = !!children;
  const statusColors = {
    pending: 'text-yellow-600 dark:text-yellow-400',
    approved: 'text-green-600 dark:text-green-400',
    rejected: 'text-red-600 dark:text-red-400',
    'needs-changes': 'text-orange-600 dark:text-orange-400',
  };

  const StatusIcon = {
    pending: AlertCircle,
    approved: CheckCircle2,
    rejected: XCircle,
    'needs-changes': AlertCircle,
  }[status || 'pending'];

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
          isSelected ? 'bg-indigo-50 dark:bg-indigo-950/50 border-r-2 border-indigo-600' : ''
        }`}
        onClick={onClick}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {label}
        </span>
        {status && (
          <StatusIcon className={`w-4 h-4 ${statusColors[status]}`} />
        )}
        {badge && (
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-6 border-l border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ModerationTreeView({
  course,
  sections,
  lectures,
  resources,
  selectedItem,
  onItemSelect,
}: ModerationTreeViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedLectures, setExpandedLectures] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleLecture = (lectureId: string) => {
    setExpandedLectures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lectureId)) {
        newSet.delete(lectureId);
      } else {
        newSet.add(lectureId);
      }
      return newSet;
    });
  };

  const getSectionLectures = (sectionId: string) => {
    return lectures.filter((l) => l.sectionId === sectionId);
  };

  const getLectureResources = (lectureId: string) => {
    return resources.filter((r) => r.lectureId === lectureId);
  };

  const getStatus = (_type: ModerationItemType, _id: string): ModerationStatus => {
    // TODO: Get actual status from API
    return 'pending';
  };

  return (
    <div className="h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Content</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{course.title}</p>
      </div>

      <div className="py-2">
        {/* Course Info */}
        <TreeNode
          icon={BookOpen}
          label="Course Info"
          status={getStatus('course', course.id)}
          isSelected={selectedItem?.type === 'course' && selectedItem?.id === course.id}
          onClick={() => onItemSelect({ type: 'course', id: course.id })}
        />

        {/* Sections */}
        <TreeNode
          icon={FolderTree}
          label="Sections"
          badge={sections.length}
          isExpanded={expandedSections.size > 0}
          onToggle={() => {
            if (expandedSections.size === sections.length) {
              setExpandedSections(new Set());
            } else {
              setExpandedSections(new Set(sections.map((s) => s.id)));
            }
          }}
        >
          {sections.map((section) => {
            const sectionLectures = getSectionLectures(section.id);
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <TreeNode
                key={section.id}
                icon={FolderTree}
                label={section.title}
                status={getStatus('section', section.id)}
                badge={sectionLectures.length}
                isExpanded={isExpanded}
                onToggle={() => toggleSection(section.id)}
                isSelected={selectedItem?.type === 'section' && selectedItem?.id === section.id}
                onClick={() => onItemSelect({ type: 'section', id: section.id, courseId: course.id })}
              >
                {sectionLectures.map((lecture) => {
                  const lectureResources = getLectureResources(lecture.id);
                  const isLectureExpanded = expandedLectures.has(lecture.id);
                  
                  return (
                    <TreeNode
                      key={lecture.id}
                      icon={Video}
                      label={lecture.title}
                      status={getStatus('lecture', lecture.id)}
                      badge={lectureResources.length}
                      isExpanded={isLectureExpanded}
                      onToggle={() => toggleLecture(lecture.id)}
                      isSelected={selectedItem?.type === 'lecture' && selectedItem?.id === lecture.id}
                      onClick={() =>
                        onItemSelect({
                          type: 'lecture',
                          id: lecture.id,
                          courseId: course.id,
                          sectionId: section.id,
                        })
                      }
                    >
                      {lectureResources.map((resource) => (
                        <TreeNode
                          key={resource.id}
                          icon={FileText}
                          label={resource.fileName}
                          status={getStatus('resource', resource.id)}
                          isSelected={selectedItem?.type === 'resource' && selectedItem?.id === resource.id}
                          onClick={() =>
                            onItemSelect({
                              type: 'resource',
                              id: resource.id,
                              courseId: course.id,
                              sectionId: section.id,
                              lectureId: lecture.id,
                            })
                          }
                        />
                      ))}
                    </TreeNode>
                  );
                })}
              </TreeNode>
            );
          })}
        </TreeNode>

        {/* Preview Video */}
        {course.promoVideoUrl && (
          <TreeNode
            icon={Video}
            label="Preview Video"
            status={getStatus('media', 'preview-video')}
            isSelected={selectedItem?.type === 'media' && selectedItem?.id === 'preview-video'}
            onClick={() => onItemSelect({ type: 'media', id: 'preview-video', courseId: course.id })}
          />
        )}

        {/* Course Media */}
        {(course.thumbnailUrl || course.primaryImageUrl) && (
          <TreeNode
            icon={Image}
            label="Course Media"
            status={getStatus('media', 'course-media')}
            isSelected={selectedItem?.type === 'media' && selectedItem?.id === 'course-media'}
            onClick={() => onItemSelect({ type: 'media', id: 'course-media', courseId: course.id })}
          />
        )}

        {/* Reviews (placeholder) */}
        <TreeNode
          icon={MessageSquare}
          label="Reviews"
          badge={0}
          status="pending"
          isSelected={selectedItem?.type === 'review' && selectedItem?.id === 'reviews'}
          onClick={() => onItemSelect({ type: 'review', id: 'reviews', courseId: course.id })}
        />
      </div>
    </div>
  );
}

