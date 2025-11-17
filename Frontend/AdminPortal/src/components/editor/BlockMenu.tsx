import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Video,
  Code,
  FileText,
  Quote,
  Minus,
} from 'lucide-react';

interface BlockMenuProps {
  onSelect: (blockType: string) => void;
  onClose: () => void;
}

const blockTypes = [
  { type: 'Text', label: 'Text', icon: Type, description: 'Plain text paragraph' },
  { type: 'Heading1', label: 'Heading 1', icon: Heading1, description: 'Large heading' },
  { type: 'Heading2', label: 'Heading 2', icon: Heading2, description: 'Medium heading' },
  { type: 'Heading3', label: 'Heading 3', icon: Heading3, description: 'Small heading' },
  { type: 'Image', label: 'Image', icon: Image, description: 'Upload an image' },
  { type: 'Video', label: 'Video', icon: Video, description: 'Embed a video' },
  { type: 'Code', label: 'Code', icon: Code, description: 'Code block with syntax highlighting' },
  { type: 'File', label: 'File', icon: FileText, description: 'Upload a file (PDF, DOCX, etc.)' },
  { type: 'Quote', label: 'Quote', icon: Quote, description: 'Quote block' },
  { type: 'Divider', label: 'Divider', icon: Minus, description: 'Horizontal divider' },
];

export default function BlockMenu({ onSelect, onClose }: BlockMenuProps) {
  return (
    <div className="absolute z-50 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-64 max-h-96 overflow-y-auto">
      <div className="p-2">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Choose Block Type
        </div>
        {blockTypes.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => onSelect(item.type)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3 transition-colors group"
            >
              <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

