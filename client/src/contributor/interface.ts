
/** User-related types */
export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    profileImage: string | null;
    preferences: {
        theme: string;
        autoSave: boolean;
        notifications: boolean;
        fileListView: string;
        language: string;
    };
    lastActive: string;
    isActive: boolean;
    createdAt: string;
}

/** Auth types */
export interface AuthPayload {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    [key: string]: unknown;
}

/** File-related types */
export interface FileMeta {
    id: string;
    name: string;
    size: number;
    url: string;
    createdAt: string;
}

export interface savedFile {
    id: string;
    name: string;
    size: number;
    url?: string;
    createdAt: string;
}

export interface saveFileOptions {
    saveToCloud: boolean;
    downloadLocal: boolean;
    fileName: string;
    content: string;
}

/** Dashboard Settings */
export type Preferences = NonNullable<UserProfile>['preferences'];

/** Toolbar */
export interface ToolbarProps {
    content: string;
    setContent: (c: string) => void;
    mode: Mode;
    setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

/** FileCard */
export interface FileCardProps {
    file: FileMeta;
    onOpen: () => void;
    onDelete: () => void;
    formatFileSize: (bytes: number) => string;
}

/** DashboardSettings */
export interface DashboardSettingsProps {
    userProfile: UserProfile | null;
    onProfileUpdate: (profile: Partial<UserProfile>) => void;
    files: FileMeta[];
}

/** UserProfileSection */
export interface UserProfileSectionProps {
    userProfile: UserProfile | null;
    onProfileUpdate: (profile: Partial<UserProfile>) => void;
}

/** EditorPage */
export type Mode = 'normal' | 'ai' | 'readonly';

/** FeatureSection */
export interface CardProps {
    title: string;
    subtitle: string;
    description: string;
    icon: string;
}

/** FeatureCarousel */
export interface Feature {
    title: string;
    description: string;
    icon: string;
    delay: number;
}

/** TypingText */
export interface TypingTextProps {
    text: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
}

/** SavePromptModel */
export interface SavePromptModelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (fileName: string) => Promise<void>;
    content: string;
}

/** Miscellaneous */
export interface FallingTextProps {
    text: string;
}