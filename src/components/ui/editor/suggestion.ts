import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { CommandList } from "./CommandList";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Image as ImageIcon,
} from "lucide-react";

export const getSuggestionProps = (addImage: () => void) => ({
  items: ({ query }: { query: string }) => {
    return [
      {
        title: "제목 1",
        description: "섹션 제목 (대)",
        icon: Heading1,
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run();
        },
      },
      {
        title: "제목 2",
        description: "섹션 제목 (중)",
        icon: Heading2,
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 2 })
            .run();
        },
      },
      {
        title: "제목 3",
        description: "섹션 제목 (소)",
        icon: Heading3,
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 3 })
            .run();
        },
      },
      {
        title: "글머리 기호 목록",
        description: "간단한 목록 만들기",
        icon: List,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "번호 매기기 목록",
        description: "순서가 있는 목록",
        icon: ListOrdered,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "인용구",
        description: "인용문 작성하기",
        icon: Quote,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
      },

      {
        title: "구분선",
        description: "내용 시각적 분리",
        icon: Minus,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: "이미지",
        description: "이미지 업로드",
        icon: ImageIcon,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).run();
          addImage();
        },
      },
    ]
      .filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 10);
  },

  render: () => {
    let component: ReactRenderer;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate: (props: any) => {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown: (props: any) => {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit: () => {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
});
