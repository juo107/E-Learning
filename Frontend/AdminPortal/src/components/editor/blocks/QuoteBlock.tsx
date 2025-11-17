import { useState, useRef, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { Block } from '../../../pages/LectureEditor';

interface QuoteBlockProps {
  block: Block;
  isSelected: boolean;
  onContentChange: (dataJson: string) => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
}

export default function QuoteBlock({
  block,
  isSelected,
  onContentChange,
  onEnter,
  onBackspace,
  onSlashCommand,
}: QuoteBlockProps) {
  const [content, setContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(block.dataJson || '{}');
      setContent(data.text || '');
    } catch {
      setContent('');
    }
  }, [block.dataJson]);

  useEffect(() => {
    if (isSelected && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isSelected]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    setContent(text);
    
    const dataJson = JSON.stringify({ text });
    onContentChange(dataJson);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    } else if (e.key === 'Backspace' && e.currentTarget.textContent === '') {
      e.preventDefault();
      onBackspace(true);
    } else if (e.key === '/' && e.currentTarget.textContent === '') {
      e.preventDefault();
      onSlashCommand();
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-1">
          <Quote className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className={`flex-1 min-h-[40px] text-gray-700 dark:text-gray-300 italic border-l-4 border-indigo-500 pl-4 focus:outline-none bg-indigo-50/50 dark:bg-indigo-900/10 rounded-r ${
            !content ? 'text-gray-400 dark:text-gray-500' : ''
          }`}
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

