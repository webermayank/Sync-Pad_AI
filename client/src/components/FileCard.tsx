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
    const [isLoading, setIsLoading] = useState(false);

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
            case 'html':
                return '🌐';
            case 'css':
                return '🎨';
            case 'py':
                return '🐍';
            case 'java':
                return '☕';
            case 'cpp':
            case 'c':
                return '⚙️';
            case 'pdf':
                return '📕';
            case 'doc':
            case 'docx':
                return '📘';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📈';
            case 'zip':
            case 'rar':
                return '📦';
            case 'img':
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️';
            case 'mp3':
            case 'wav':
            case 'flac':
                return '🎵';
            case 'mp4':
            case 'avi':
            case 'mkv':
                return '🎬';
            default:
                return '📄';
        }
    };

    const handleOpen = async () => {
        setIsLoading(true);
        try {
            await onOpen();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            await onDelete();
        } finally {
            setIsLoading(false);
        }
    };

    const handleMainAreaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleOpen();
    };

    return (
        <div
            className={`file-card ${isLoading ? 'loading' : ''}`}
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
                        onClick={handleOpen}
                        title="Open file"
                        disabled={isLoading}
                    >
                        📖
                    </button>
                    <button
                        className="action-btn delete-btn"
                        onClick={handleDelete}
                        title="Delete file"
                        disabled={isLoading}
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div className="file-card-content" onClick={handleMainAreaClick}>
                <h3 className="file-name" title={file.name}>
                    {file.name}
                </h3>
                <div className="file-meta">
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <span className="file-date">{formatDate(file.createdAt)}</span>
                </div>
            </div>

            <div className="file-card-footer">
                <button
                    className="open-file-btn"
                    onClick={handleOpen}
                    disabled={isLoading}
                >
                    {isLoading ? 'Opening...' : 'Open'}
                </button>
            </div>
        </div>
    );
};

export default FileCard;