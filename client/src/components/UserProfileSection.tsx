import React, { useState, useRef, useEffect } from 'react';
import { uploadProfileImage, type UserProfile } from '../services/userService';
import '../styles/UserProfileSection.css';
import '../styles/landing.css'

interface UserProfileSectionProps {
    userProfile: UserProfile | null;
    onProfileUpdate: (profile: Partial<UserProfile>) => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
    userProfile,
    onProfileUpdate
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        if (userProfile?.preferences?.theme) {
            setTheme(userProfile.preferences.theme);
        }
    }, [userProfile]);

    // Add this effect to sync displayName with userProfile prop
    useEffect(() => {
        setDisplayName(userProfile?.displayName || '');
    }, [userProfile?.displayName]);

    const handleNameSave = async () => {
        try {
            if (displayName.trim()) {
                await onProfileUpdate({ displayName: displayName.trim() });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving name:', error);
            alert('Failed to save name. Please try again.');

        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        try {
           
            const imageUrl = await uploadProfileImage(file);
            await onProfileUpdate({ profileImage: imageUrl });
            setUploading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploading(false);
        }
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSave = () => {
        onProfileUpdate({
            displayName,
            preferences: { ...userProfile!.preferences, theme }
        });
    };

    if (!userProfile) return <div>Loading profile...</div>;

    return (
        <div className="user-profile-section">
            <div className="profile-header">
                <div className="profile-image-container">
                    {userProfile?.profileImage ? (
                        <img
                            src={userProfile.profileImage}
                            alt="Profile"
                            className="profile-image"
                        />
                    ) : (
                        <div className="profile-avatar">
                            {userProfile?.displayName ? getInitials(userProfile.displayName) : '?'}
                        </div>
                    )}
                    <button
                        className="change-image-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? '⏳' : '📷'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="profile-name-section">
                    {isEditing ? (
                        <div className="name-edit-form">
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your name"
                                className="name-input"
                                maxLength={50}
                                autoFocus
                            />
                            <div className="name-edit-actions">
                                <button
                                    className="save-btn"
                                    onClick={handleNameSave}
                                    disabled={!displayName.trim()}
                                >
                                    ✓
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setDisplayName(userProfile?.displayName || '');
                                        setIsEditing(false);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="name-display">
                            <h2 className="user-name">
                                {userProfile?.displayName || 'Set your name'}
                            </h2>
                            <button
                                className="edit-name-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                ✏️
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-info">
                <div className="info-item">
                    <span className="info-label">Member since:</span>
                    <span className="info-value">
                        {userProfile?.createdAt
                            ? new Date(userProfile.createdAt).toLocaleDateString()
                            : 'Unknown'
                        }
                    </span>
                </div>
                <div className="info-item">
                    <span className="info-label">Last active:</span>
                    <span className="info-value">
                        {userProfile?.lastActive
                            ? new Date(userProfile.lastActive).toLocaleDateString()
                            : 'Now'
                        }
                    </span>
                </div>
            </div>

            <div className="theme-section">
                <label>Theme:</label>
                <select value={theme} onChange={e => setTheme(e.target.value)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                </select>
            </div>
            <button className='landing-hero__button' onClick={handleSave}>Save</button>
        </div>
    );
};

export default UserProfileSection;