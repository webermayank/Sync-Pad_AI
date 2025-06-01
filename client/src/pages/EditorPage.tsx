import React, { useState } from "react";
import Toolbar from "../components/Toolbar";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";

const EditorPage: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [selection, setSelection] = useState<{
    text: string;
    rect: DOMRect;
  } | null>(null);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const handleApply = () => {
    if (aiOutput) setContent((c) => c + "\n" + aiOutput);
    setAiOutput(null);
  };
  const handleDiscard = () => setAiOutput(null);

  return (
    <div className="editor-page">
      <Toolbar content={content} setContent={setContent} />
      <div className="editor-container">
        <div className="editor-main">
          <Editor
            content={content}
            setContent={setContent}
            onSelectText={(text, rect) => setSelection({ text, rect })}
          />
          {selection && (
            <Sidebar
              selection={selection}
              onClose={() => setSelection(null)}
              onResponse={(resp) => {
                setAiOutput(resp);
                setSelection(null);
              }}
            />
          )}
        </div>
        {aiOutput && (
          <div className="editor-output">
            <div className="editor-output__content">{aiOutput}</div>
            <div className="editor-output__actions">
              <button
                className="editor-output__button editor-output__button--apply"
                onClick={handleApply}
              >
                Apply
              </button>
              <button
                className="editor-output__button editor-output__button--discard"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;
