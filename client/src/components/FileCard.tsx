import React, { useState } from 'react';
import { type FileMeta } from '../services/fileService';
import '../styles/FileCard.css';

interface FileCardProps {
    file: FileMeta;
    onOpen: () => void;
    onDelete: () => void;
    formatFileSize: (bytes: number) => string;
}

const FileCard: React.FC<FileCardProps> = ({ file, onOpen, onDelete, formatFileSize }) => {
    const [showActions, setShowActions] = useState(false);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'txt':
                return '📄';
            case 'md':
                return '📝';
            case 'json':
                return '🔧';
            case 'js':
            case 'ts':
                return '📜';
            default:
                return '📄';
        }
    };

    return (
        <div
            className="file-card"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="file-card-header">
                <div className="file-icon">
                    {getFileIcon(file.name)}
                </div>
                <div className={`file-actions ${showActions ? 'show' : ''}`}>
                    <button
                        className="action-btn open-btn"
                        onClick={onOpen}
                        title="Open file"
                    >
                        📖
                    </button>
                    <button
                        className="action-btn delete-btn"
                        onClick={onDelete}
                        title="Delete file"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div className="file-card-content" onClick={onOpen}>
                <h3 className="file-name" title={file.name}>
                    {file.name}
                </h3>
                <div className="file-meta">
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <span className="file-date">{formatDate(file.createdAt)}</span>
                </div>
            </div>

            <div className="file-card-footer">
                <button className="open-file-btn" onClick={onOpen}>
                    Open
                </button>
            </div>
        </div>
    );
};

export default FileCard;