import React, { useState } from "react";
import '../styles/Navbar.css';
import { ModeToggle, type Mode } from "./ModeToggle";
import { Link } from "react-router-dom";
import SavePromptModal from "./SavePromptModel";
import { uploadFile } from "../services/fileService";

interface ToolbarProps {
  content: string;
  setContent: (c: string) => void;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ content, setContent, mode, setMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
  };

  const handleExportClick = () => {
    setIsModalOpen(true);
  };

  const handleSaveToCloud = async (fileName: string) => {
    try {
      // Create a file object from the content
      const fileContent = new Blob([content], { type: "text/plain" });
      const file = new File([fileContent], `${fileName}.txt`, { type: "text/plain" });

      // Upload to cloud storage
      await uploadFile(file);

      // Also download locally
      const url = URL.createObjectURL(fileContent);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      // Show success message (you can replace this with a toast notification)
      alert(`File "${fileName}" saved successfully to cloud and downloaded locally!`);

    } catch (error) {
      console.error('Error saving file:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
        <button onClick={handleExportClick} className="editor-toolbar__button import-label">
          Export
        </button>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <SavePromptModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveToCloud}
        content={content}
      />
    </>
  );
};

export default Toolbar;