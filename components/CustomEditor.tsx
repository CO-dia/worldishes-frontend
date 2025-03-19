import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { DraftHandleValue, EditorState, convertToRaw } from "draft-js";

const CustomEditor = ({ onChange }: { onChange: (value: string) => void }) => {
  // Initial state for the editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [length, setLength] = useState(0);
  const maxLength = 5000;
  const [lastTypedTime, setLastTypedTime] = useState<number | null>(null);

  // Function to handle changes in the editor
  const onEditorStateChange = (newEditorState: EditorState) => {
    const content = newEditorState.getCurrentContent();
    const plainText = content.getPlainText(); // Extract plain text
    const tempLength = plainText.length;

    if (tempLength > maxLength) {
      return; // Stop updating if the limit is exceeded
    }

    setLength(tempLength);
    setEditorState(newEditorState);
    setLastTypedTime(Date.now()); // Update last typed time
  };

  // Function to handle pasting (to prevent exceeding limit)
  const handleBeforeInput = (
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number
  ): DraftHandleValue => {
    const currentLength = editorState.getCurrentContent().getPlainText().length;

    if (currentLength + chars.length > maxLength) {
      return "handled"; // Prevent input
    }

    return "not-handled"; // Allow input
  };

  // Function to handle pasting
  const handlePastedText = (
    pastedText: string,
    html: string,
    editorState: EditorState,
    onChange: (editorState: EditorState) => void
  ) => {
    const currentLength = editorState.getCurrentContent().getPlainText().length;

    return currentLength + pastedText.length > maxLength; // Allow pasting
  };

  // Function to get the editor's content as JSON
  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    onChange(JSON.stringify(rawContent));
  };

  // Function to auto-save after 1 second of no typing
  useEffect(() => {
    if (!lastTypedTime) return;

    const timeout = setTimeout(() => {
      saveContent();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [lastTypedTime]); // Triggered when lastTypedTime updates

  return (
    <div className="flex flex-col rounded-md border border-[#ddd]">
      <Editor
        editorClassName="min-h-[150px] px-3"
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        //@ts-ignore
        handleBeforeInput={handleBeforeInput} // Blocks exceeding input
        handlePastedText={handlePastedText} // Blocks exceeding pasting
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "list",
            "textAlign",
            "link",
            "emoji",
          ],
          inline: {
            inDropdown: false,
            options: ["bold", "italic", "underline", "strikethrough"],
          },
          blockType: {
            inDropdown: true,
            options: [
              "Normal",
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "Blockquote",
              "Code",
            ],
          },
          fontSize: {
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
          },
          list: {
            inDropdown: false,
            options: ["unordered", "ordered"],
          },
          textAlign: {
            inDropdown: true,
            options: ["left", "center", "right", "justify"],
          },
          colorPicker: {
            colors: [
              "rgb(97,189,109)",
              "rgb(26,188,156)",
              "rgb(84,172,210)",
              "rgb(44,130,201)",
              "rgb(147,101,184)",
              "rgb(71,85,119)",
              "rgb(204,204,204)",
              "rgb(65,168,95)",
              "rgb(0,168,133)",
              "rgb(61,142,185)",
              "rgb(41,105,176)",
              "rgb(85,57,130)",
              "rgb(40,50,78)",
              "rgb(0,0,0)",
              "rgb(247,218,100)",
              "rgb(251,160,38)",
              "rgb(235,107,86)",
              "rgb(226,80,65)",
              "rgb(163,143,132)",
              "rgb(239,239,239)",
              "rgb(255,255,255)",
              "rgb(250,197,28)",
              "rgb(243,121,52)",
              "rgb(209,72,65)",
              "rgb(184,49,47)",
              "rgb(124,112,107)",
              "rgb(209,213,216)",
            ],
          },
          link: {
            inDropdown: true,
            showOpenOptionOnHover: true,
            defaultTargetOption: "_self",
            options: ["link", "unlink"],
          },
          emoji: {
            emojis: [
              "😀",
              "😁",
              "😂",
              "😃",
              "😉",
              "😋",
              "😎",
              "😍",
              "😗",
              "🤗",
              "🤔",
              "😣",
              "😫",
              "😴",
              "😌",
              "🤓",
              "😛",
              "😜",
              "😠",
              "😇",
              "😷",
              "😈",
              "👻",
              "😺",
              "😸",
              "😹",
              "😻",
              "😼",
              "😽",
              "🙀",
              "🙈",
              "🙉",
              "🙊",
              "👼",
              "👮",
              "🕵",
              "💂",
              "👳",
              "🎅",
              "👸",
              "👰",
              "👲",
              "🙍",
              "🙇",
              "🚶",
              "🏃",
              "💃",
              "⛷",
              "🏂",
              "🏌",
              "🏄",
              "🚣",
              "🏊",
              "⛹",
              "🏋",
              "🚴",
              "👫",
              "💪",
              "👈",
              "👉",
              "👉",
              "👆",
              "🖕",
              "👇",
              "🖖",
              "🤘",
              "🖐",
              "👌",
              "👍",
              "👎",
              "✊",
              "👊",
              "👏",
              "🙌",
              "🙏",
              "🐵",
              "🐶",
              "🐇",
              "🐥",
              "🐸",
              "🐌",
              "🐛",
              "🐜",
              "🐝",
              "🍉",
              "🍄",
              "🍔",
              "🍤",
              "🍨",
              "🍪",
              "🎂",
              "🍰",
              "🍾",
              "🍷",
              "🍸",
              "🍺",
              "🌍",
              "🚑",
              "⏰",
              "🌙",
              "🌝",
              "🌞",
              "⭐",
              "🌟",
              "🌠",
              "🌨",
              "🌩",
              "⛄",
              "🔥",
              "🎄",
              "🎈",
              "🎉",
              "🎊",
              "🎁",
              "🎗",
              "🏀",
              "🏈",
              "🎲",
              "🔇",
              "🔈",
              "📣",
              "🔔",
              "🎵",
              "🎷",
              "💰",
              "🖊",
              "📅",
              "✅",
              "❎",
              "💯",
            ],
          },
        }}
      />
      <small className="w-full text-end pr-3 pb-3 text-xs">
        {length} / {maxLength}
      </small>
    </div>
  );
};

export default CustomEditor;
