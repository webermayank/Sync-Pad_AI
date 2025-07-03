import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFiles, deleteFile, type FileMeta } from '../services/fileService';
import { getUserProfile, updateUserProfile, type UserProfile } from '../services/userService';
import { useFileContent } from '../context/FileContentContext';
import FileCard from './FileCard';
import UserProfileSection from './UserProfileSection';
import DashboardSettings from './DashboardSettings';
import '../styles/Dashboard.css';

// interface DashboardProps {
//     setContent?: (content: string) => void;
// }

const Dashboard: React.FC = () => {
    const [files, setFiles] = useState<FileMeta[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'files' | 'settings'>('files');
    const navigate = useNavigate();
    const { setContent } = useFileContent();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [filesData, profileData] = await Promise.all([
                fetchFiles(),
                getUserProfile()
            ]);
            setFiles(filesData);
            setUserProfile(profileData);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileOpen = async (file: FileMeta) => {
        try {
            const response = await fetch(file.url);
            const content = await response.text();
            setContent(content);
            navigate('/editor');
        } catch (err) {
            console.error('Error opening file:', err);
            setError('Failed to open file');
        }
    };

    const handleFileDelete = async (fileId: string) => {
        if (!window.confirm('Are you sure you want to delete this file?')) {
            return;
        }

        try {
            await deleteFile(fileId);
            setFiles(files.filter(f => f.id !== fileId));
        } catch (err) {
            console.error('Error deleting file:', err);
            setError('Failed to delete file');
        }
    };

    const handleProfileUpdate = async (updatedProfile: Partial<UserProfile>) => {
        try {
            const updated = await updateUserProfile(updatedProfile);
            setUserProfile(updated);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const totalFiles = files.length;
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className='back-to-home'>
                    <button
                        className="back-to-home-btn"
                        onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                </div>
                <div className="dashboard-tabs">
                    <button
                        className={`tab-button ${activeTab === 'files' ? 'active' : ''}`}
                        onClick={() => setActiveTab('files')}
                    >
                        My Files
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div className="dashboard-content">
                <div className="dashboard-sidebar">
                    <UserProfileSection
                        userProfile={userProfile}
                        onProfileUpdate={handleProfileUpdate}
                    />

                    <div className="dashboard-stats">
                        <h3>Storage Stats</h3>
                        <div className="stat-item">
                            <span className="stat-label">Total Files:</span>
                            <span className="stat-value">{totalFiles}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Total Size:</span>
                            <span className="stat-value">{formatFileSize(totalSize)}</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main">
                    {activeTab === 'files' && (
                        <div className="files-section">
                            <div className="files-header">
                                <h2>Your Files</h2>
                                <button
                                    className="new-file-btn"
                                    onClick={() => navigate('/editor')}
                                >
                                    + New File
                                </button>
                            </div>

                            {files.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📄</div>
                                    <h3>No files yet</h3>
                                    <p>Create your first file to get started!</p>
                                    <button
                                        className="create-first-file-btn"
                                        onClick={() => navigate('/editor')}
                                    >
                                        Create File
                                    </button>
                                </div>
                            ) : (
                                <div className="files-grid">
                                    {files.map((file) => (
                                        <FileCard
                                            key={file.id}
                                            file={file}
                                            onOpen={() => handleFileOpen(file)}
                                            onDelete={() => handleFileDelete(file.id)}
                                            formatFileSize={formatFileSize}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && userProfile && (
                        <DashboardSettings
                            userProfile={userProfile}
                            onProfileUpdate={handleProfileUpdate}
                            files={files}
                      />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;