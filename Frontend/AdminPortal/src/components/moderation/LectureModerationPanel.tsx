import { CheckCircle2, XCircle, AlertCircle, Video, FileText, Download, Clock } from 'lucide-react';
import { LectureDto } from '../../services/adminService';
import { CourseDetailsDto } from '../../services/adminService';
import { SectionDto } from '../../services/adminService';
import { ResourceDto } from '../../services/adminService';
import { LectureContentDto } from '../../services/lectureContentService';

interface LectureModerationPanelProps {
  lecture: LectureDto;
  course: CourseDetailsDto;
  section: SectionDto | undefined;
  resources: ResourceDto[];
  lectureContents: LectureContentDto[];
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: (notes: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function LectureModerationPanel({
  lecture,
  course,
  section,
  resources,
  lectureContents,
  onApprove,
  onReject,
  onRequestChanges,
  notes,
  onNotesChange,
}: LectureModerationPanelProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatType = (type: string) => {
    switch (type) {
      case '0':
      case 'Video':
        return 'Video';
      case '1':
      case 'Text':
        return 'Text';
      case '2':
      case 'Quiz':
        return 'Quiz';
      case '3':
      case 'Assignment':
        return 'Assignment';
      default:
        return type;
    }
  };

  const formatFileSize = (sizeKB?: number) => {
    if (!sizeKB) return 'N/A';
    if (sizeKB < 1024) {
      return `${sizeKB} KB`;
    }
    return `${(sizeKB / 1024).toFixed(2)} MB`;
  };

  const renderContentBlock = (block: LectureContentDto) => {
    try {
      const data = JSON.parse(block.dataJson || '{}');
      
      switch (block.blockType) {
        case 'Text':
          // Support both old format (text) and new format (html from Tiptap)
          const textContent = data.html || data.text || '';
          return (
            <div className="prose dark:prose-invert max-w-none break-words">
              {data.html ? (
                <div 
                  className="text-gray-700 dark:text-gray-300 break-words"
                  dangerouslySetInnerHTML={{ __html: textContent }}
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{textContent}</p>
              )}
            </div>
          );
        case 'Heading1':
        case 'Heading2':
        case 'Heading3':
          const level = block.blockType === 'Heading1' ? 'text-2xl' : block.blockType === 'Heading2' ? 'text-xl' : 'text-lg';
          return (
            <h3 className={`${level} font-bold text-gray-900 dark:text-white mb-2`}>
              {data.text || ''}
            </h3>
          );
        case 'Image':
          return data.url ? (
            <div className="my-4">
              <img src={data.url} alt={data.caption || 'Image'} className="w-full rounded-lg" />
              {data.caption && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{data.caption}</p>
              )}
            </div>
          ) : null;
        case 'Video':
          return data.url ? (
            <div className="my-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={data.url} controls className="w-full h-full" />
              </div>
              {data.caption && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{data.caption}</p>
              )}
            </div>
          ) : null;
        case 'Code':
          return (
            <div className="my-4 bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{data.language || 'code'}</span>
              </div>
              <pre className="text-sm text-gray-100 font-mono">
                <code>{data.code || ''}</code>
              </pre>
            </div>
          );
        case 'Quote':
          return (
            <div className="my-4 border-l-4 border-indigo-500 pl-4 italic text-gray-700 dark:text-gray-300">
              {data.text || ''}
            </div>
          );
        case 'Divider':
          return <div className="my-4 h-px bg-gray-300 dark:bg-gray-700" />;
        case 'File':
          return data.url ? (
            <div className="my-4 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{data.fileName || 'File'}</p>
                {data.fileSize && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(data.fileSize)}</p>
                )}
              </div>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ) : null;
        default:
          return (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              Block type: {block.blockType}
            </div>
          );
      }
    } catch (error) {
      return (
        <div className="text-sm text-red-500 dark:text-red-400">
          Error parsing block content
        </div>
      );
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lecture.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {section?.title} • {formatType(lecture.type)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              lecture.isPreviewable
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {lecture.isPreviewable ? 'Previewable' : 'Not Previewable'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Main Content - Wider */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          {lecture.type === 'Video' || lecture.type === '0' ? (
            lecture.videoUrl ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Video Content
                </h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={lecture.videoUrl}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Duration: {formatDuration(lecture.duration)}</span>
                  <span>Order: {lecture.orderIndex}</span>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
                <p className="text-yellow-800 dark:text-yellow-400">
                  ⚠️ Video URL not provided
                </p>
              </div>
            )
          ) : null}

          {/* Text Content */}
          {lecture.type === 'Text' || lecture.type === '1' ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Text Content
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <div
                  className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: lecture.content || 'No content provided' }}
                />
              </div>
            </div>
          ) : null}

          {/* Lecture Content Blocks */}
          {lectureContents.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Content Blocks ({lectureContents.length})
              </h3>
              <div className="space-y-4">
                {lectureContents.map((block) => (
                  <div
                    key={block.id}
                    className="border-l-4 border-indigo-500 pl-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-r break-words"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded">
                        {block.blockType}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Order: {block.orderIndex}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      {renderContentBlock(block)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {resources.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resources ({resources.length})
              </h3>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {resource.fileName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {resource.resourceType} • {formatFileSize(resource.fileSizeKB)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
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
          {/* Lecture Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lecture Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatType(lecture.type)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDuration(lecture.duration)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Index</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {lecture.orderIndex}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Resources</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {resources.length} file(s)
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Content Blocks</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {lectureContents.length} block(s)
                </p>
              </div>
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
                Approve Lecture
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
                Reject Lecture
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

