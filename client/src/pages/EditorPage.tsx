import React, { useState } from "react";
import Toolbar from "../components/Toolbar";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import { type Mode } from "../components/ModeToggle";
import "../styles/editor.css";

const EditorPage: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [selection, setSelection] = useState<{
    text: string;
    rect: DOMRect;
  } | null>(null);
  const [aiOutput, setAiOutput] = useState<string>("");
  const [mode, setMode] = useState<Mode>('normal');

  const handleApply = () => {
    if (aiOutput) setContent((c) => c + "\n" + aiOutput);
    setAiOutput("");
  };
  const handleDiscard = () => {
    setAiOutput("");
  }

  return (
    <div className="editor-page">
      <Toolbar content={content} setContent={setContent} mode={mode} setMode ={setMode} />
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
          mode={mode}          
          onClose={() => setSelection(null)}
          onChunk={(chunk) => setAiOutput((c) => c + chunk)}
          onStart={() => {}}
        />
      )}
        </div>
        {aiOutput && (
          <div className="editor-output">
            <div className="editor-output__content">{aiOutput}</div>
            <div className="editor-output__actions">
              <button
                className="editor-output__button input-label"
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
