import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService, CourseDetailsDto } from '../services/adminService';
import { sectionService, SectionDto } from '../services/adminService';
import { lectureService, LectureDto } from '../services/adminService';
import { resourceService, ResourceDto } from '../services/adminService';
import { lectureContentService, LectureContentDto } from '../services/lectureContentService';
import {
  ModerationTreeView,
  ModerationContentPanel,
  ModerationActionBar,
  ModerationItemType,
  SelectedItem,
} from '../components/moderation';
import { showToast } from '../components/ui/Toast';
import { Loader2 } from 'lucide-react';

export type { ModerationItemType, SelectedItem };

export default function Moderation() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId') || '';

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetailsDto | null>(null);
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [lectures, setLectures] = useState<LectureDto[]>([]);
  const [resources, setResources] = useState<ResourceDto[]>([]);
  const [lectureContents, setLectureContents] = useState<Record<string, LectureContentDto[]>>({});
  
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [moderationNotes, setModerationNotes] = useState<Record<string, string>>({});
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Load course data
  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId);
    } else {
      // No courseId provided, stop loading
      setLoading(false);
    }
  }, [courseId]);

  const loadCourseData = async (id: string) => {
    try {
      setLoading(true);
      
      // Load course details
      const courseRes = await courseService.getById(id);
      const courseData = courseRes.data?.data || courseRes.data;
      if (courseRes.success && courseData) {
        setCourse(courseData);
      } else if (!courseRes.success) {
        console.error('Failed to load course:', courseRes);
        showToast('Failed to load course', 'error');
        setLoading(false);
        return;
      }

      // Load sections
      const sectionsRes = await sectionService.getByCourseId(id);
      const sectionsData = sectionsRes.data?.data || sectionsRes.data || [];
      if (sectionsRes.success) {
        setSections(Array.isArray(sectionsData) ? sectionsData : []);
        
        // Load lectures for each section
        const allLectures: LectureDto[] = [];
        for (const section of (Array.isArray(sectionsData) ? sectionsData : [])) {
          try {
            const lecturesRes = await lectureService.getBySectionId(section.id);
            const lecturesData = lecturesRes.data?.data || lecturesRes.data || [];
            if (lecturesRes.success && Array.isArray(lecturesData)) {
              allLectures.push(...lecturesData);
            }
          } catch (err) {
            console.error(`Error loading lectures for section ${section.id}:`, err);
          }
        }
        setLectures(allLectures);

        // Load resources and lecture contents for each lecture
        const allResources: ResourceDto[] = [];
        const contentsMap: Record<string, LectureContentDto[]> = {};
        
        for (const lecture of allLectures) {
          try {
            // Load resources
            const resourcesRes = await resourceService.getByLectureId(lecture.id);
            const resourcesData = resourcesRes.data?.data || resourcesRes.data || [];
            if (resourcesRes.success && Array.isArray(resourcesData)) {
              allResources.push(...resourcesData);
            }
            
            // Load lecture contents
            const contentsRes = await lectureContentService.getByLectureId(lecture.id);
            const contentsData = contentsRes.data?.data || contentsRes.data || [];
            if (contentsRes.success && Array.isArray(contentsData)) {
              contentsMap[lecture.id] = contentsData.sort((a: LectureContentDto, b: LectureContentDto) => a.orderIndex - b.orderIndex);
            } else {
              contentsMap[lecture.id] = [];
            }
          } catch (err) {
            console.error(`Error loading data for lecture ${lecture.id}:`, err);
            contentsMap[lecture.id] = [];
          }
        }
        setResources(allResources);
        setLectureContents(contentsMap);
      } else {
        setSections([]);
      }

      // Auto-select course if no selection
      if (!selectedItem) {
        setSelectedItem({ type: 'course', id });
      }
    } catch (error: any) {
      showToast('Failed to load course data', 'error');
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item: SelectedItem) => {
    setSelectedItem(item);
  };

  const handleApprove = async (_type: ModerationItemType, _id: string) => {
    try {
      // TODO: Implement API call to approve
      showToast('Item approved successfully', 'success');
    } catch (error: any) {
      showToast('Failed to approve item', 'error');
    }
  };

  const handleReject = async (_type: ModerationItemType, _id: string, _reason?: string) => {
    try {
      // TODO: Implement API call to reject
      showToast('Item rejected', 'success');
    } catch (error: any) {
      showToast('Failed to reject item', 'error');
    }
  };

  const handleRequestChanges = async (_type: ModerationItemType, id: string, notes: string) => {
    try {
      // TODO: Implement API call to request changes
      setModerationNotes({ ...moderationNotes, [id]: notes });
      showToast('Changes requested', 'success');
    } catch (error: any) {
      showToast('Failed to request changes', 'error');
    }
  };

  const handleApproveAll = async () => {
    if (!course) return;
    
    try {
      // TODO: Implement API call to approve all
      showToast('All items approved successfully', 'success');
    } catch (error: any) {
      showToast('Failed to approve all items', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading moderation panel...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No course selected</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Please select a course from the course management page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Action Bar - Always visible at top */}
      <ModerationActionBar
        course={course}
        onApproveAll={handleApproveAll}
        onReject={() => handleReject('course', course.id)}
        onRequestChanges={(notes) => handleRequestChanges('course', course.id, notes)}
        notes={moderationNotes[course.id] || ''}
        onNotesChange={(notes: string) => setModerationNotes({ ...moderationNotes, [course.id]: notes })}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tree View */}
        <div className="w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto flex-shrink-0">
          <ModerationTreeView
            course={course}
            sections={sections}
            lectures={lectures}
            resources={resources}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
          />
        </div>

        {/* Right Content Panel - Wider */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-w-0">
          {selectedItem && (
            <ModerationContentPanel
              selectedItem={selectedItem}
              course={course}
              sections={sections}
              lectures={lectures}
              resources={resources}
              lectureContents={lectureContents}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestChanges={handleRequestChanges}
              notes={moderationNotes[selectedItem.id] || ''}
              onNotesChange={(notes: string) => setModerationNotes({ ...moderationNotes, [selectedItem.id]: notes })}
              checklist={checklist}
              onChecklistChange={setChecklist}
            />
          )}
        </div>
      </div>
    </div>
  );
}

