import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface EditorProps {
  content: string;
  setContent: (c: string) => void;
  onSelectText: (text: string, rect: DOMRect) => void;
}

const Editor: React.FC<EditorProps> = ({ content, setContent, onSelectText }) => {
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
      const range = sel.getRangeAt(0);
      onSelectText(sel.toString(), range.getBoundingClientRect());
    }
  };

  return (
    <div onMouseUp={handleMouseUp} className="h-full">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="h-full"
      />
    </div>
  );
};
export default Editor;