import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onEnter?: () => void;
  onBackspace?: (isEmpty: boolean) => void;
  onSlashCommand?: () => void;
  editable?: boolean;
  className?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "Type '/' for commands, or start typing...",
  onEnter,
  onBackspace,
  onSlashCommand,
  editable = true,
  className = '',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
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
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Handle Enter to create new block
        if (event.key === 'Enter' && !event.shiftKey) {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          
          // Check if we're at the end of the document
          if ($from.parentOffset === $from.parent.content.size && $from.parent.type.name === 'paragraph') {
            const isEmpty = editor.isEmpty;
            if (isEmpty || editor.getText().trim() === '') {
              event.preventDefault();
              if (onEnter) {
                onEnter();
              }
              return true;
            }
          }
        }
        
        // Handle Backspace when empty
        if (event.key === 'Backspace') {
          const isEmpty = editor.isEmpty || editor.getText().trim() === '';
          if (isEmpty && onBackspace) {
            event.preventDefault();
            onBackspace(true);
            return true;
          }
        }
        
        // Handle slash command
        if (event.key === '/' && editor.isEmpty) {
          if (onSlashCommand) {
            event.preventDefault();
            onSlashCommand();
            return true;
          }
        }
        
        return false;
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`tiptap-editor ${className}`}>
      <EditorContent editor={editor} />
    </div>
  );
}

