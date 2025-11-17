import { useState, useRef, useEffect } from 'react';
import { Code } from 'lucide-react';
import { Block } from '../../../pages/LectureEditor';

interface CodeBlockProps {
  block: Block;
  isSelected: boolean;
  onContentChange: (dataJson: string) => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
}

const languages = ['javascript', 'typescript', 'python', 'csharp', 'java', 'html', 'css', 'sql', 'json'];

export default function CodeBlock({
  block,
  isSelected,
  onContentChange,
  onEnter,
  onBackspace,
  onSlashCommand,
}: CodeBlockProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(block.dataJson || '{}');
      setCode(data.code || '');
      setLanguage(data.language || 'javascript');
    } catch {
      setCode('');
      setLanguage('javascript');
    }
  }, [block.dataJson]);

  useEffect(() => {
    if (isSelected && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isSelected]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    const dataJson = JSON.stringify({ code: newCode, language });
    onContentChange(dataJson);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    const dataJson = JSON.stringify({ code, language: newLanguage });
    onContentChange(dataJson);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      onContentChange(JSON.stringify({ code: newCode, language }));
      
      setTimeout(() => {
        e.currentTarget.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Code Block</span>
          </div>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-2 py-1 text-xs bg-gray-700 dark:bg-gray-800 text-gray-300 dark:text-gray-400 border border-gray-600 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <textarea
          ref={editorRef}
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter your code here..."
          className="w-full h-64 px-4 py-3 bg-gray-900 dark:bg-gray-950 text-gray-100 dark:text-gray-100 font-mono text-sm focus:outline-none resize-none"
          style={{ fontFamily: 'monospace' }}
        />
      </div>
    </div>
  );
}

