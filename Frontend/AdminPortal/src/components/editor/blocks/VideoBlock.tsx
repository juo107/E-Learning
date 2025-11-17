import { useState, useRef, useEffect } from 'react';
import { Video, Upload, X } from 'lucide-react';
import { Block } from '../../../pages/LectureEditor';

interface VideoBlockProps {
  block: Block;
  isSelected: boolean;
  onContentChange: (dataJson: string) => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
}

export default function VideoBlock({
  block,
  isSelected,
  onContentChange,
  onEnter,
  onBackspace,
  onSlashCommand,
}: VideoBlockProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(block.dataJson || '{}');
      setVideoUrl(data.url || '');
      setCaption(data.caption || '');
    } catch {
      setVideoUrl('');
      setCaption('');
    }
  }, [block.dataJson]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload file to server/Cloudinary
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    const dataJson = JSON.stringify({ url, caption });
    onContentChange(dataJson);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    
    const dataJson = JSON.stringify({ url, caption });
    onContentChange(dataJson);
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    
    const dataJson = JSON.stringify({ url: videoUrl, caption: newCaption });
    onContentChange(dataJson);
  };

  if (!videoUrl) {
    return (
      <div
        className={`px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/30 ${
          isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <div className="space-y-4">
          <input
            ref={urlInputRef}
            type="text"
            placeholder="Paste video URL or upload file..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handleUrlChange}
          />
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Upload className="w-4 h-4" />
              <span>Or upload video file</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="relative group">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video src={videoUrl} controls className="w-full h-full" />
        </div>
        {isSelected && (
          <button
            onClick={() => {
              setVideoUrl('');
              setCaption('');
              onContentChange(JSON.stringify({ url: '', caption: '' }));
            }}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <input
        type="text"
        value={caption}
        onChange={handleCaptionChange}
        placeholder="Add a caption..."
        className="w-full mt-2 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 bg-transparent border-b border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none"
      />
    </div>
  );
}

