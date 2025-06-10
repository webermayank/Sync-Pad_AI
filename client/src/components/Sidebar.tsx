import React, { useState } from "react";
import type { Mode } from "./ModeToggle";
// import axios from "axios";

interface SidebarProps {
  selection: { text: string; rect: DOMRect };
  onClose: () => void;
  mode: Mode;
  onStart: () => void;
  onChunk: (chunk: string) => void;

}

const operations = ["summarize", "enhance", "explain"] as const;

type Op = (typeof operations)[number];

const Sidebar: React.FC<SidebarProps> = ({
  selection,
  onClose,
  onStart,
  onChunk,
  mode,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOp = async (op: Op) => {
    setLoading(true);
    setError(null);
    onStart();
    
    try {
      const response = await fetch("/api/text/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: selection.text, operation: op, mode }),
      });
      if (!response.ok || !response.body) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }


      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

// as chunk arrive
     while (!done){
      const {value, done: doneReading} = await reader.read();
      done = doneReading;
      const chunkText = decoder.decode(value, {stream:true});
      onChunk(chunkText); 
     }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const style = {
    position: "absolute" as const,
    top: selection.rect.bottom + 8 + window.scrollY,
    left: selection.rect.left + window.scrollX,
  };

  return (
    <div style={style} className="editor-sidebar">
      {operations.map((op) => (
        <button
          key={op}
          onClick={() => handleOp(op)}
          disabled={loading}
          className="editor-sidebar__button"
        >
          {op.charAt(0).toUpperCase() + op.slice(1)}
        </button>
      ))}
      {loading && <span>Patience...</span>}
      {error && <span className="editor-sidebar__error">{error}</span>}
    </div>
  );
};

export default Sidebar;
