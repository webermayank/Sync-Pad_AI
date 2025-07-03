/* src/components/DashboardSettings.tsx */
import React, { useState, useEffect } from 'react';
import { type UserProfile } from '../services/userService';
import { type FileMeta } from '../services/fileService'; // Import FileMeta
import '../styles/DashboardSettings.css';

interface DashboardSettingsProps {
    userProfile: UserProfile | null;
    onProfileUpdate: (profile: Partial<UserProfile>) => void;
    files: FileMeta[]; // Add this prop
}


type Preferences = NonNullable<UserProfile>['preferences'];

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
    userProfile,
    onProfileUpdate,
    files // Add this prop
}) => {
   
    const [settings, setSettings] = useState<Preferences>({
        theme: userProfile?.preferences.theme ?? 'light',
        autoSave: userProfile?.preferences.autoSave ?? true,
        notifications: userProfile?.preferences.notifications ?? true,
        fileListView: userProfile?.preferences.fileListView ?? 'grid',
        language: userProfile?.preferences.language ?? 'en'
    });

   
    useEffect(() => {
        if (userProfile) {
            setSettings({
                theme: userProfile.preferences.theme,
                autoSave: userProfile.preferences.autoSave,
                notifications: userProfile.preferences.notifications,
                fileListView: userProfile.preferences.fileListView,
                language: userProfile.preferences.language
            });
        }
    }, [userProfile]);

    
    const handleSettingChange = <K extends keyof Preferences>(
        key: K,
        value: Preferences[K]
    ) => {
        const newSettings = { ...settings, [key]: value } as Preferences;
        setSettings(newSettings);

       
        onProfileUpdate({ preferences: newSettings });
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleAccountDeletion = () => {
        if (showDeleteConfirm) {
            alert('Account deletion would be processed here');
            setShowDeleteConfirm(false);
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const exportData = () => {
        const userData = {
            profile: userProfile,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-syncpad-data.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Calculate storage used (in bytes)
    const totalBytes = files.reduce((acc, file) => acc + (file.size || 0), 0);
    const maxBytes = 500 * 1024 * 1024; // 500 MB
    const percentUsed = Math.min((totalBytes / maxBytes) * 100, 100);

    // Helper to format bytes
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    if (!userProfile) return <div>Loading settings...</div>;

    return (
        <div className="dashboard-settings">
            <h2>Settings</h2>

            <div className="settings-section">
                <h3>Appearance</h3>
                <div className="setting-item">
                    <label className="setting-label">
                        Theme
                        <select
                            value={settings.theme}
                            onChange={e => handleSettingChange('theme', e.target.value as Preferences['theme'])}
                            className="setting-select"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                        </select>
                    </label>
                </div>

                <div className="setting-item">
                    <label className="setting-label">
                        File List View
                        <select
                            value={settings.fileListView}
                            onChange={e => handleSettingChange('fileListView', e.target.value as Preferences['fileListView'])}
                            className="setting-select"
                        >
                            <option value="grid">Grid</option>
                            <option value="list">List</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h3>Editor Preferences</h3>
                <div className="setting-item">
                    <label className="setting-checkbox">
                        <input
                            type="checkbox"
                            checked={settings.autoSave}
                            onChange={e => handleSettingChange('autoSave', e.target.checked as Preferences['autoSave'])}
                        />
                        <span className="checkmark"></span>
                        Auto-save files
                    </label>
                </div>

                <div className="setting-item">
                    <label className="setting-label">
                        Language
                        <select
                            value={settings.language}
                            onChange={e => handleSettingChange('language', e.target.value as Preferences['language'])}
                            className="setting-select"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h3>Notifications</h3>
                <div className="setting-item">
                    <label className="setting-checkbox">
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={e => handleSettingChange('notifications', e.target.checked as Preferences['notifications'])}
                        />
                        <span className="checkmark"></span>
                        Enable notifications
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h3>Account</h3>
                <div className="setting-item">
                    <button className="export-btn" onClick={exportData}>
                        📥 Export My Data
                    </button>
                    <p className="setting-description">
                        Download all your profile data and files
                    </p>
                </div>

                <div className="setting-item danger-zone">
                    <h4>Danger Zone</h4>
                    <button
                        className={`delete-account-btn ${showDeleteConfirm ? 'confirm' : ''}`}
                        onClick={handleAccountDeletion}
                    >
                        {showDeleteConfirm ? '⚠️ Confirm Delete Account' : '🗑️ Delete Account'}
                    </button>
                    {showDeleteConfirm && (
                        <div className="delete-warning">
                            <p>This action cannot be undone. All your files will be permanently deleted.</p>
                            <button
                                className="cancel-delete-btn"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="settings-section">
                <h3>Storage Info</h3>
                <div className="storage-info">
                    <div className="storage-bar">
                        <div
                            className="storage-used"
                            style={{
                                width: `${percentUsed}%`,
                                background: percentUsed >= 95
                                    ? 'linear-gradient(90deg, #ef4444 0%, #f59e42 100%)'
                                    : 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                            }}
                        ></div>
                    </div>
                    <p>
                        {formatFileSize(totalBytes)} used of 500 MB
                        {percentUsed >= 100 && (
                            <span className="storage-limit-warning"> (Limit reached!)</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardSettings;
