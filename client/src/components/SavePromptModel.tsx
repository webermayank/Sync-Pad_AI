import React, { useState } from 'react';
import '../styles/savePrompts.css';

interface SavePromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (fileName: string) => void;
    content: string;
}

const SavePromptModal: React.FC<SavePromptModalProps> = ({
    isOpen,
    onClose,
    onSave,
    content
}) => {
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fileName.trim()) {
            setError('Please enter a file name');
            return;
        }

        if (fileName.length > 50) {
            setError('File name must be less than 50 characters');
            return;
        }

        // Validate file name (no special characters except underscore and dash)
        const validNameRegex = /^[a-zA-Z0-9_-\s]+$/;
        if (!validNameRegex.test(fileName)) {
            setError('File name can only contain letters, numbers, spaces, underscores, and dashes');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await onSave(fileName.trim());
            handleClose();
        } catch (err) {
            setError('Failed to save file. Please try again.');
            console.error('Save error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFileName('');
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleDownloadLocal = () => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName.trim() ? `${fileName.trim()}.txt` : "export.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Save File</h2>
                    <button
                        className="modal-close-btn"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="fileName">File Name</label>
                        <input
                            type="text"
                            id="fileName"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            placeholder="Enter file name"
                            disabled={isLoading}
                            autoFocus
                        />
                        {error && <span className="error-message">{error}</span>}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="btn btn-tertiary"
                            onClick={handleDownloadLocal}
                            disabled={isLoading || !fileName.trim()}
                        >
                            Download Only
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || !fileName.trim()}
                        >
                            {isLoading ? 'Saving...' : 'Save to Cloud'}
                        </button>
                    </div>
                </form>

                <div className="modal-info">
                    <p>Your file will be saved to the cloud and available in your dashboard.</p>
                </div>
            </div>
        </div>
    );
};

export default SavePromptModal;