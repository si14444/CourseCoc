import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { SlashCommand } from "./editor/SlashCommand";
import { getSuggestionProps } from "./editor/suggestion";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "./button";
import { useCallback, useRef, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "내용을 입력하세요... ('/'를 입력하여 명령어 사용)",
  className = "",
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto shadow-sm",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-[var(--coral-pink)] underline hover:no-underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      SlashCommand.configure({
        suggestion: getSuggestionProps(addImage),
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `제목 ${node.attrs.level}`;
          }
          return placeholder;
        },
        includeChildren: true,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px] p-8 max-w-4xl",
      },
    },
  });

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-[var(--color-border)] rounded-xl p-8 min-h-[400px] bg-white animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-1/3 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-50 rounded w-full"></div>
          <div className="h-4 bg-gray-50 rounded w-5/6"></div>
          <div className="h-4 bg-gray-50 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  const colors = [
    "#000000",
    "#374151",
    "#6B7280",
    "#EF4444",
    "#F97316",
    "#EAB308",
    "#22C55E",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#ff6b6b",
  ];

  return (
    <div
      className={`prose-editor relative bg-white overflow-hidden ${className}`}
    >
      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[500px] cursor-text" />

      {/* Placeholder Text Style Handling */}
      <style jsx global>{`
        .ProseMirror > .is-empty::before,
        .ProseMirror > p.is-empty::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }
      `}</style>

      {/* Link Dialog Modal */}
      {showLinkDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-4">링크 추가</h3>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--coral-pink)]"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setShowLinkDialog(false)}>
                취소
              </Button>
              <Button
                onClick={linkUrl ? setLink : removeLink}
                className="bg-[var(--coral-pink)] hover:bg-[var(--coral-pink)]/90 text-white"
              >
                {linkUrl ? "적용" : "제거"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Image Input */}
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
