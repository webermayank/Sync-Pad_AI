import React from "react";
// import axios from 'axios';

interface ToolbarProps {
  content: string;
  setContent: (c: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ content, setContent }) => {
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
    <div
      className="p-2 bg-gray-100 flex space-x-4 rounded-lg quicksand-uniquifier"
      style={{ fontSize: "1.05rem" }}
    >
      <label
        className="px-6 py-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 transition duration-200 cursor-pointer"
        style={{ fontSize: "0.95rem" }}
      >
        Import
        <input
          type="file"
          accept=".txt"
          onChange={handleImport}
          className="hidden"
        />
      </label>

      <button
        onClick={handleExport}
        className="px-6 py-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 transition duration-200"
        style={{ fontSize: "0.95rem" }}
      >
        Export
      </button>
    </div>
  );
};

export default Toolbar;
