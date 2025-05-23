import React, { useState } from 'react';
import axios from 'axios';

interface SidebarProps {
  selection: { text: string; rect: DOMRect };
  onClose: () => void;
  appendResponse: (resp: string) => void;
}

const operations = ['summarize', 'enhance', 'explain'] as const;

type Op = typeof operations[number];

const Sidebar: React.FC<SidebarProps> = ({ selection, onClose, appendResponse }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOp = async (op: Op) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/text/process', {
        text: selection.text,
        operation: op,
      });
      appendResponse(res.data.processedText);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const style = {
    position: 'absolute' as const,
    top: selection.rect.bottom + 8 + window.scrollY,
    left: selection.rect.left + window.scrollX,
    background: '#333',
    padding: '8px',
    borderRadius: '8px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  };

  return (
    <div style={style}>
      {operations.map((op) => (
        <button key={op} onClick={() => handleOp(op)} disabled={loading} className="px-2 py-1 bg-beige rounded">
          {op.charAt(0).toUpperCase() + op.slice(1)}
        </button>
      ))}
      {loading && <span>Loading...</span>}
      {error && <span className="text-red-400">{error}</span>}
    </div>
  );
};
export default Sidebar;
