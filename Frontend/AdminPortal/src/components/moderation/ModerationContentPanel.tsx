import { SelectedItem, ModerationItemType } from './types';
import { CourseDetailsDto } from '../../services/adminService';
import { SectionDto } from '../../services/adminService';
import { LectureDto } from '../../services/adminService';
import { ResourceDto } from '../../services/adminService';
import { LectureContentDto } from '../../services/lectureContentService';
import {
  CourseSummaryPanel,
  SectionModerationPanel,
  LectureModerationPanel,
  MediaModerationPanel,
} from './index';

interface ModerationContentPanelProps {
  selectedItem: SelectedItem;
  course: CourseDetailsDto;
  sections: SectionDto[];
  lectures: LectureDto[];
  resources: ResourceDto[];
  lectureContents: Record<string, LectureContentDto[]>;
  onApprove: (type: ModerationItemType, id: string) => void | Promise<void>;
  onReject: (type: ModerationItemType, id: string, reason?: string) => void | Promise<void>;
  onRequestChanges: (type: ModerationItemType, id: string, notes: string) => void | Promise<void>;
  notes: string;
  onNotesChange: (notes: string) => void;
  checklist: Record<string, boolean>;
  onChecklistChange: (checklist: Record<string, boolean>) => void;
}

export default function ModerationContentPanel({
  selectedItem,
  course,
  sections,
  lectures,
  resources,
  lectureContents,
  onApprove,
  onReject,
  onRequestChanges,
  notes,
  onNotesChange,
  checklist,
  onChecklistChange,
}: ModerationContentPanelProps) {
  const renderContent = () => {
    switch (selectedItem.type) {
      case 'course':
        return (
          <CourseSummaryPanel
            course={course}
            sections={sections}
            lectures={lectures}
            onApprove={() => onApprove('course', selectedItem.id)}
            onReject={() => onReject('course', selectedItem.id)}
            onRequestChanges={(notes: string) => onRequestChanges('course', selectedItem.id, notes)}
            notes={notes}
            onNotesChange={onNotesChange}
            checklist={checklist}
            onChecklistChange={onChecklistChange}
          />
        );

      case 'section':
        const section = sections.find((s) => s.id === selectedItem.id);
        if (!section) return null;
        return (
          <SectionModerationPanel
            section={section}
            course={course}
            lectures={lectures.filter((l) => l.sectionId === section.id)}
            onApprove={() => onApprove('section', selectedItem.id)}
            onReject={() => onReject('section', selectedItem.id)}
            onRequestChanges={(notes: string) => onRequestChanges('section', selectedItem.id, notes)}
            notes={notes}
            onNotesChange={onNotesChange}
          />
        );

      case 'lecture':
        const lecture = lectures.find((l) => l.id === selectedItem.id);
        if (!lecture) return null;
        return (
          <LectureModerationPanel
            lecture={lecture}
            course={course}
            section={sections.find((s) => s.id === lecture.sectionId)}
            resources={resources.filter((r) => r.lectureId === lecture.id)}
            lectureContents={lectureContents[lecture.id] || []}
            onApprove={() => onApprove('lecture', selectedItem.id)}
            onReject={() => onReject('lecture', selectedItem.id)}
            onRequestChanges={(notes: string) => onRequestChanges('lecture', selectedItem.id, notes)}
            notes={notes}
            onNotesChange={onNotesChange}
          />
        );

      case 'resource':
        const resource = resources.find((r) => r.id === selectedItem.id);
        if (!resource) return null;
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Resource: {resource.fileName}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-gray-600 dark:text-gray-400">Resource moderation panel coming soon...</p>
            </div>
          </div>
        );

      case 'media':
        return (
          <MediaModerationPanel
            course={course}
            onApprove={() => onApprove('media', selectedItem.id)}
            onReject={() => onReject('media', selectedItem.id)}
            onRequestChanges={(notes: string) => onRequestChanges('media', selectedItem.id, notes)}
            notes={notes}
            onNotesChange={onNotesChange}
          />
        );

      case 'review':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-gray-600 dark:text-gray-400">Reviews moderation panel coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="h-full overflow-y-auto">{renderContent()}</div>;
}

