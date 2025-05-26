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
  "bullet",
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

  // Memoize modules to avoid recreation on every render
  const modules = useMemo(
    () => ({
      toolbar: toolbarOptions,
    }),
    []
  );

  return (
    <div
      onMouseUp={handleMouseUp}
      className="h-full quicksand-uniquifier p-[4vh] rounded-lg"
    >
      <style>{`.ql-toolbar { border-radius: 0.5rem !important; }`}</style>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="h-full"
        style={{
          fontSize: "1.1rem",
          minHeight: "80vh",
          fontFamily: "Quicksand, sans-serif",
        }}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};
export default Editor;
