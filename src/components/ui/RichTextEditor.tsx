"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { Button } from './button';
import { useCallback, useState, useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "내용을 입력하세요...",
  className = ""
}: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--coral-pink)] underline hover:no-underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const addImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-[var(--color-border)] rounded-lg p-4 min-h-[400px] bg-[var(--very-light-pink)] animate-pulse">
        <div className="h-4 bg-[var(--light-pink)] rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-[var(--light-pink)] rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-[var(--light-pink)] rounded w-2/3"></div>
      </div>
    );
  }

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6',
    '#8B5CF6', '#EC4899', '#ff6b6b', '#06B6D4', '#84CC16'
  ];

  return (
    <div className={`border border-[var(--color-border)] rounded-lg overflow-hidden bg-white ${className}`}>
      {/* 툴바 */}
      <div className="border-b border-[var(--color-border)] p-3 bg-[var(--very-light-pink)]">
        <div className="flex flex-wrap items-center gap-2">
          {/* 텍스트 포맷팅 */}
          <div className="flex items-center gap-1 border-r border-[var(--color-border)] pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              data-active={editor.isActive('bold')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              data-active={editor.isActive('italic')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              data-active={editor.isActive('underline')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              data-active={editor.isActive('strike')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              data-active={editor.isActive('code')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          {/* 제목 */}
          <div className="flex items-center gap-1 border-r border-[var(--color-border)] pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              data-active={editor.isActive('heading', { level: 1 })}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              data-active={editor.isActive('heading', { level: 2 })}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              data-active={editor.isActive('heading', { level: 3 })}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          {/* 리스트 */}
          <div className="flex items-center gap-1 border-r border-[var(--color-border)] pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              data-active={editor.isActive('bulletList')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              data-active={editor.isActive('orderedList')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              data-active={editor.isActive('blockquote')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          {/* 정렬 */}
          <div className="flex items-center gap-1 border-r border-[var(--color-border)] pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              data-active={editor.isActive({ textAlign: 'left' })}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              data-active={editor.isActive({ textAlign: 'center' })}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              data-active={editor.isActive({ textAlign: 'right' })}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* 색상 */}
          <div className="relative border-r border-[var(--color-border)] pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="h-8 w-8 p-0"
            >
              <Palette className="h-4 w-4" />
            </Button>
            {showColorPicker && (
              <div className="absolute top-full mt-1 p-2 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-10">
                <div className="grid grid-cols-5 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 링크 */}
          <div className="relative border-r border-[var(--color-border)] pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkDialog(!showLinkDialog)}
              data-active={editor.isActive('link')}
              className="h-8 w-8 p-0 data-[active=true]:bg-[var(--coral-pink)] data-[active=true]:text-white"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            {showLinkDialog && (
              <div className="absolute top-full mt-1 p-3 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-10 w-64">
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="링크 URL을 입력하세요"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-[var(--color-border)] rounded"
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={removeLink}>
                      제거
                    </Button>
                    <Button size="sm" onClick={setLink}>
                      확인
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 이미지 */}
          <div className="border-r border-[var(--color-border)] pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={addImage}
              className="h-8 w-8 p-0"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* 실행취소/다시실행 */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 에디터 */}
      <div className="prose-editor">
        <EditorContent
          editor={editor}
          className="min-h-[400px] max-w-none"
        />
        {!content && (
          <div className="absolute top-16 left-4 text-[var(--text-secondary)] pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* 숨겨진 이미지 input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}