import api from './api';

export interface SectionDto {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  isPreviewable: boolean;
  lecturesCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LectureDto {
  id: string;
  sectionId: string;
  title: string;
  type: string;
  duration: number;
  videoUrl?: string;
  content?: string;
  orderIndex: number;
  isPreviewable: boolean;
  resourcesCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SectionWithLecturesDto extends SectionDto {
  lectures: LectureDto[];
}

/**
 * Get all sections for a course (public API, no auth required)
 */
export async function getSectionsByCourseId(courseId: string): Promise<SectionWithLecturesDto[]> {
  try {
    const res = await api.get(`/api/course/${courseId}/sections`);
    const data = res.data?.data || res.data;
    
    if (Array.isArray(data)) {
      return data.map((section: any) => ({
        id: section.id,
        courseId: section.courseId,
        title: section.title,
        description: section.description,
        orderIndex: section.orderIndex,
        isPreviewable: section.isPreviewable ?? false,
        lecturesCount: section.lecturesCount || (section.lectures?.length || 0),
        createdAt: section.createdAt,
        updatedAt: section.updatedAt,
        lectures: (section.lectures || []).map((lecture: any) => ({
          id: lecture.id,
          sectionId: lecture.sectionId,
          title: lecture.title,
          type: lecture.type,
          duration: lecture.duration || 0,
          videoUrl: lecture.videoUrl,
          content: lecture.content,
          orderIndex: lecture.orderIndex,
          isPreviewable: lecture.isPreviewable ?? false,
          resourcesCount: lecture.resourcesCount || 0,
          createdAt: lecture.createdAt,
          updatedAt: lecture.updatedAt,
        })),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
}

