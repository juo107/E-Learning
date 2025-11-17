import { FileText, Hash } from 'lucide-react';
import { LectureDto } from '../../services/adminService';
import { Block } from '../../pages/LectureEditor';

interface EditorSidebarProps {
  blocks: Block[];
  lecture: LectureDto;
  onBlockSelect: (blockId: string) => void;
}

export default function EditorSidebar({ blocks, lecture, onBlockSelect }: EditorSidebarProps) {
  // Extract headings for outline
  const headings = blocks
    .filter(block => ['Heading1', 'Heading2', 'Heading3'].includes(block.blockType))
    .map(block => {
      try {
        const data = JSON.parse(block.dataJson || '{}');
        return {
          id: block.id,
          level: block.blockType === 'Heading1' ? 1 : block.blockType === 'Heading2' ? 2 : 3,
          text: data.text || 'Untitled',
          orderIndex: block.orderIndex,
        };
      } catch {
        return null;
      }
    })
    .filter((h): h is NonNullable<typeof h> => h !== null)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="w-64 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="p-6">
        {/* Lecture Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Lecture Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-2 text-gray-900">{lecture.type}</span>
            </div>
            {lecture.duration && (
              <div>
                <span className="text-gray-500">Duration:</span>
                <span className="ml-2 text-gray-900">
                  {Math.floor(lecture.duration / 60)}m {lecture.duration % 60}s
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Blocks:</span>
              <span className="ml-2 text-gray-900">{blocks.length}</span>
            </div>
          </div>
        </div>

        {/* Outline */}
        {headings.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Outline
            </h3>
            <nav className="space-y-1">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => onBlockSelect(heading.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    heading.level === 1
                      ? 'text-base font-semibold text-gray-900'
                      : heading.level === 2
                      ? 'text-sm font-medium text-gray-700 ml-4'
                      : 'text-xs text-gray-600 ml-8'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-3 h-3" />
                    <span className="truncate">{heading.text}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Block Types Summary */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Block Types</h3>
          <div className="space-y-1 text-xs">
            {Object.entries(
              blocks.reduce((acc, block) => {
                acc[block.blockType] = (acc[block.blockType] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([type, count]) => (
              <div key={type} className="flex justify-between text-gray-600">
                <span>{type}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

