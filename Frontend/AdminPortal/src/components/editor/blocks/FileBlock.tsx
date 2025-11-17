import { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Download, X } from 'lucide-react';
import { Block } from '../../../pages/LectureEditor';

interface FileBlockProps {
  block: Block;
  isSelected: boolean;
  onContentChange: (dataJson: string) => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
}

export default function FileBlock({
  block,
  isSelected,
  onContentChange,
  onEnter,
  onBackspace,
  onSlashCommand,
}: FileBlockProps) {
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(block.dataJson || '{}');
      setFileName(data.fileName || '');
      setFileUrl(data.url || '');
      setFileSize(data.fileSize || null);
    } catch {
      setFileName('');
      setFileUrl('');
      setFileSize(null);
    }
  }, [block.dataJson]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload file to server
    const url = URL.createObjectURL(file);
    setFileName(file.name);
    setFileUrl(url);
    setFileSize(file.size);
    
    const dataJson = JSON.stringify({
      fileName: file.name,
      url,
      fileSize: file.size,
    });
    onContentChange(dataJson);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!fileUrl) {
    return (
      <div
        className={`px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-800/30 ${
          isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <Upload className="w-8 h-8" />
          <span className="text-sm">Click to upload file</span>
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 dark:text-white truncate">{fileName}</div>
            {fileSize && (
              <div className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(fileSize)}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={fileUrl}
              download={fileName}
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            {isSelected && (
              <button
                onClick={() => {
                  setFileName('');
                  setFileUrl('');
                  setFileSize(null);
                  onContentChange(JSON.stringify({ fileName: '', url: '', fileSize: null }));
                }}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

