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
    <div className="h-screen flex flex-col">
      <Toolbar content={content} setContent={setContent} />
      <div className="flex-1 flex flex-row bg-transparent">
        <div className="flex-1 relative flex flex-col h-full">
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
          <div
            className="flex flex-col items-center justify-start ml-8 bg-[#d8d0c4] rounded-[2rem] p-8 "
            style={{ width: 320, minHeight: 320 }}
          >
            <div
              className="mb-4 w-full text-black pl-[12vh] pr-[11vh] pt-[8vh]"
              // style={{ wordBreak: "break-word" }}
            >
              {aiOutput}
            </div>
            <div className="flex gap-4 mt-auto">
              <button
                className="p-[12px] m-[4px] bg-black text-white rounded-3xl hover:bg-gray-800"
                onClick={handleApply}
              >
                Apply
              </button>
              <button
                className="p-[12px] m-[4px]  bg-gray-300 text-black rounded-xl hover:bg-gray-400"
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
