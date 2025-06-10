import React from "react";
import '../styles/Navbar.css';
import { ModeToggle, type Mode } from "./ModeToggle";
import { Link } from "react-router-dom";

interface ToolbarProps {
  content: string;
  setContent: (c: string) => void;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ content, setContent, mode, setMode }) => {
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="editor-toolbar quicksand-uniquifier">
      <Link to="/" className="navbar-logo" style={{ color: 'black', marginTop: '10px', textShadow: '' }}>
        SYNCPAD
      </Link>
      <label className="editor-toolbar__button import-label">
        Import
        <input
          type="file"
          accept=".txt"
          onChange={handleImport}
          className="hidden-file-input"
        />
      </label>
      <button onClick={handleExport} className="editor-toolbar__button import-label">
        Export
      </button>
      {/* Add ModeToggle here */}
      <ModeToggle mode={mode} setMode={setMode} />
    </div>
  );
};

export default Toolbar;