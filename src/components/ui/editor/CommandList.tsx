import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image as ImageIcon,
  Quote,
  Code,
  Minus,
} from "lucide-react";

export const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[300px] p-1">
      {props.items.length ? (
        props.items.map((item: any, index: number) => (
          <button
            key={index}
            className={`flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors text-left ${
              index === selectedIndex
                ? "bg-[var(--very-light-pink)] text-[var(--coral-pink)]"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              selectItem(index);
            }}
          >
            <div
              className={`p-1 mr-2 rounded border ${
                index === selectedIndex
                  ? "border-[var(--coral-pink)] bg-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              {item.element || (
                <item.icon
                  className={`w-4 h-4 ${
                    index === selectedIndex
                      ? "text-[var(--coral-pink)]"
                      : "text-gray-500"
                  }`}
                />
              )}
            </div>
            <div>
              <div className="font-medium flex items-center">{item.title}</div>
              {item.description && (
                <div
                  className={`text-xs ${
                    index === selectedIndex
                      ? "text-[var(--coral-pink)]/80"
                      : "text-gray-400"
                  }`}
                >
                  {item.description}
                </div>
              )}
            </div>
          </button>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-gray-500">결과 없음</div>
      )}
    </div>
  );
});

CommandList.displayName = "CommandList";
