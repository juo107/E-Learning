import { useState, useRef, useEffect } from 'react';
import { Block } from '../../../pages/LectureEditor';

interface HeadingBlockProps {
  block: Block;
  level: 1 | 2 | 3;
  isSelected: boolean;
  onContentChange: (dataJson: string) => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
}

export default function HeadingBlock({
  block,
  level,
  isSelected,
  onContentChange,
  onEnter,
  onBackspace,
  onSlashCommand,
}: HeadingBlockProps) {
  const [content, setContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  const headingStyles = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-semibold',
    3: 'text-xl font-semibold',
  };

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
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`min-h-[40px] px-4 py-3 ${headingStyles[level]} text-gray-900 dark:text-white focus:outline-none ${
        !content ? 'text-gray-400 dark:text-gray-500' : ''
      }`}
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
      data-placeholder={`Heading ${level}...`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

