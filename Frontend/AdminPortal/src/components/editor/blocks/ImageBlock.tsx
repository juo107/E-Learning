import { useState, useRef, useEffect } from 'react';
import { Image, X, Upload } from 'lucide-react';
import { Block } from '../../../pages/LectureEditor';

interface ImageBlockProps {
  block: Block;
  isSelected: boolean;
  onContentChange: (dataJson: string) => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
}

export default function ImageBlock({
  block,
  isSelected,
  onContentChange,
  onEnter,
  onBackspace,
  onSlashCommand,
}: ImageBlockProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(block.dataJson || '{}');
      setImageUrl(data.url || '');
      setCaption(data.caption || '');
    } catch {
      setImageUrl('');
      setCaption('');
    }
  }, [block.dataJson]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload file to server/Cloudinary
    // For now, create object URL
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    const dataJson = JSON.stringify({ url, caption });
    onContentChange(dataJson);
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    
    const dataJson = JSON.stringify({ url: imageUrl, caption: newCaption });
    onContentChange(dataJson);
  };

  if (!imageUrl) {
    return (
      <div
        className={`px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-800/30 ${
          isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <Upload className="w-8 h-8" />
          <span className="text-sm">Click to upload image</span>
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="relative group">
        <img
          src={imageUrl}
          alt={caption || 'Image'}
          className="w-full rounded-lg shadow-md"
        />
        {isSelected && (
          <button
            onClick={() => {
              setImageUrl('');
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

