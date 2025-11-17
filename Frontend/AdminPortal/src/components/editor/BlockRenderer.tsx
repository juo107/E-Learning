import { useState, useRef } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { Block } from '../../pages/LectureEditor';
import TextBlock from './blocks/TextBlock';
import HeadingBlock from './blocks/HeadingBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoBlock from './blocks/VideoBlock';
import CodeBlock from './blocks/CodeBlock';
import FileBlock from './blocks/FileBlock';
import QuoteBlock from './blocks/QuoteBlock';
import DividerBlock from './blocks/DividerBlock';
import BlockMenu from './BlockMenu';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onContentChange: (dataJson: string) => void;
  onTypeChange: (blockType: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
  showBlockMenu: boolean;
  onBlockMenuSelect: (blockType: string) => void;
  onBlockMenuClose: () => void;
  onReorder: (newOrder: { blockId: string; orderIndex: number }[]) => void;
  blocks: Block[];
}

export default function BlockRenderer({
  block,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onContentChange,
  onTypeChange,
  onDelete,
  onEnter,
  onBackspace,
  onSlashCommand,
  showBlockMenu,
  onBlockMenuSelect,
  onBlockMenuClose,
  onReorder,
  blocks,
}: BlockRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const renderBlockContent = () => {
    const commonProps = {
      block,
      isSelected,
      onContentChange,
      onEnter,
      onBackspace,
      onSlashCommand,
    };

    switch (block.blockType) {
      case 'Text':
        return <TextBlock {...commonProps} />;
      case 'Heading1':
      case 'Heading2':
      case 'Heading3':
        return <HeadingBlock {...commonProps} level={parseInt(block.blockType.replace('Heading', '')) as 1 | 2 | 3} />;
      case 'Image':
        return <ImageBlock {...commonProps} />;
      case 'Video':
        return <VideoBlock {...commonProps} />;
      case 'Code':
        return <CodeBlock {...commonProps} />;
      case 'File':
        return <FileBlock {...commonProps} />;
      case 'Quote':
        return <QuoteBlock {...commonProps} />;
      case 'Divider':
        return <DividerBlock {...commonProps} />;
      default:
        return <TextBlock {...commonProps} />;
    }
  };

  return (
    <div className="relative group">
      {/* Drag Handle & Delete Button - Positioned on the right side */}
      {(isHovered || isSelected) && (
        <div className="absolute -right-12 top-2 flex items-center gap-1 z-10">
          <div
            ref={dragHandleRef}
            className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded border border-gray-200 shadow-sm"
            title="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors bg-white rounded border border-gray-200 shadow-sm hover:border-red-300"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        id={`block-${block.id}`}
        ref={blockRef}
        className={`group relative rounded-lg transition-all ${
          isSelected 
            ? 'ring-2 ring-indigo-500 bg-white shadow-md' 
            : 'bg-white/50 hover:bg-white border border-transparent hover:border-gray-200'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onSelect}
      >
        {/* Block Content */}
        <div className="min-h-[40px]">
          {renderBlockContent()}
        </div>

        {/* Block Type Menu (Slash Command) */}
        {showBlockMenu && (
          <BlockMenu
            onSelect={(blockType) => {
              onBlockMenuSelect(blockType);
              onBlockMenuClose();
            }}
            onClose={onBlockMenuClose}
          />
        )}
      </div>
    </div>
  );
}

