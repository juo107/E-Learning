import { Block } from '../../../pages/LectureEditor';

interface DividerBlockProps {
  block: Block;
  isSelected: boolean;
  onContentChange: (dataJson: string) => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
}

export default function DividerBlock({
  isSelected,
}: DividerBlockProps) {
  return (
    <div className="px-4 py-6">
      <div className={`h-px bg-gray-300 dark:bg-gray-600 ${isSelected ? 'ring-2 ring-indigo-500 rounded-full bg-indigo-500' : 'hover:bg-gray-400 dark:hover:bg-gray-500'}`} />
    </div>
  );
}

