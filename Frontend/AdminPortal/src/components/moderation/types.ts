export type ModerationItemType = 'course' | 'section' | 'lecture' | 'resource' | 'media' | 'review';

export interface SelectedItem {
  type: ModerationItemType;
  id: string;
  courseId?: string;
  sectionId?: string;
  lectureId?: string;
}

