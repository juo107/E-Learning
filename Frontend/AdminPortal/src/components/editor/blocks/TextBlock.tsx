import { useState, useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { EditorContent } from '@tiptap/react';
import { Block } from '../../../pages/LectureEditor';
import TiptapToolbar from '../TiptapToolbar';

interface TextBlockProps {
  block: Block;
  isSelected: boolean;
  onContentChange: (dataJson: string) => void;
  onEnter: () => void;
  onBackspace: (isEmpty: boolean) => void;
  onSlashCommand: () => void;
}

export default function TextBlock({
  block,
  isSelected,
  onContentChange,
  onEnter,
  onBackspace,
  onSlashCommand,
}: TextBlockProps) {
  const [htmlContent, setHtmlContent] = useState('');

  // Parse initial content from dataJson
  useEffect(() => {
    try {
      const data = JSON.parse(block.dataJson || '{}');
      // Support both old format (text) and new format (html)
      setHtmlContent(data.html || data.text || '');
    } catch {
      setHtmlContent('');
    }
  }, [block.dataJson]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands, or start typing...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 dark:text-indigo-400 hover:underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
    ],
    content: htmlContent,
    editable: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Save as HTML in dataJson
      const dataJson = JSON.stringify({ html });
      onContentChange(dataJson);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Handle Enter to create new block (only when at end and empty or just whitespace)
        if (event.key === 'Enter' && !event.shiftKey) {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          
          // Check if we're at the end of the document
          const isAtEnd = $from.parentOffset === $from.parent.content.size;
          const isEmpty = editor.isEmpty || editor.getText().trim() === '';
          
          if (isAtEnd && isEmpty) {
            event.preventDefault();
            onEnter();
            return true;
          }
        }
        
        // Handle Backspace when empty
        if (event.key === 'Backspace') {
          const isEmpty = editor.isEmpty || editor.getText().trim() === '';
          if (isEmpty) {
            event.preventDefault();
            onBackspace(true);
            return true;
          }
        }
        
        // Handle slash command when empty
        if (event.key === '/' && editor.isEmpty) {
          event.preventDefault();
          onSlashCommand();
          return true;
        }
        
        return false;
      },
    },
  });

  // Update content when block.dataJson changes externally
  useEffect(() => {
    if (editor) {
      try {
        const data = JSON.parse(block.dataJson || '{}');
        const newHtml = data.html || data.text || '';
        const currentHtml = editor.getHTML();
        
        // Only update if different to avoid infinite loops
        if (newHtml !== currentHtml) {
          editor.commands.setContent(newHtml, { emitUpdate: false });
        }
      } catch {
        editor.commands.setContent('', { emitUpdate: false });
      }
    }
  }, [block.dataJson, editor]);

  // Focus when selected
  useEffect(() => {
    if (isSelected && editor) {
      editor.commands.focus();
    }
  }, [isSelected, editor]);

  if (!editor) {
    return (
      <div className="min-h-[40px] px-4 py-3 text-gray-400 dark:text-gray-500">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-[40px]">
      {/* Toolbar - Show when selected */}
      {isSelected && <TiptapToolbar editor={editor} />}
      
      {/* Editor Content */}
      <div 
        className={`px-4 py-3 ${isSelected ? 'border-t border-gray-200' : ''}`}
        onClick={() => editor.commands.focus()}
        style={{
          color: 'inherit',
        }}
      >
        <EditorContent 
          editor={editor}
          className="max-w-none focus:outline-none cursor-text"
          style={{
            color: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
