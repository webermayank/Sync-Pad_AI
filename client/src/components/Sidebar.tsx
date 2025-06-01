import React, { useState } from "react";
import axios from "axios";

interface SidebarProps {
  selection: { text: string; rect: DOMRect };
  onClose: () => void;
  onResponse: (resp: string) => void;
}

const operations = ["summarize", "enhance", "explain"] as const;

type Op = (typeof operations)[number];

const Sidebar: React.FC<SidebarProps> = ({
  selection,
  onClose,
  onResponse,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOp = async (op: Op) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/text/process", {
        text: selection.text,
        operation: op,
      });
      onResponse(res.data.processedText);
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
      {loading && <span>Loading...</span>}
      {error && <span className="editor-sidebar__error">{error}</span>}
    </div>
  );
};

export default Sidebar;
