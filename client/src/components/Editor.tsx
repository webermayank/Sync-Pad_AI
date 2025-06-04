import React, { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  content: string;
  setContent: (c: string) => void;
  onSelectText: (text: string, rect: DOMRect) => void;
}

const toolbarOptions = [
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link", "image"],
];

const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "align",
  "link",
  "image",
];

const Editor: React.FC<EditorProps> = ({
  content,
  setContent,
  onSelectText,
}) => {
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
      const range = sel.getRangeAt(0);
      onSelectText(sel.toString(), range.getBoundingClientRect());
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: toolbarOptions,
    }),
    [],
  );

  return (
    <div onMouseUp={handleMouseUp} className="editor-main">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="editor-main__quill"
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
