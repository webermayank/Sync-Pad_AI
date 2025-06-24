import axios from 'axios';

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

export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const response = await axios.get<UserProfile>('/api/user/profile', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        // Return a default profile if the API call fails
        return {
            id: 'temp-user',
            email: 'user@example.com',
            displayName: '',
            createdAt: new Date().toISOString(),
            preferences: {
                theme: 'light',
                autoSave: true,
                notifications: true,
                fileListView: 'grid',
                language: 'en'
            },
            lastActive: new Date().toISOString(),
            isActive: true,
            profileImage: null
        };
    }
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    try {
        const response = await axios.patch<UserProfile>('/api/user/profile', updates, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const uploadProfileImage = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post<{ imageUrl: string }>('/api/user/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.imageUrl;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

export const deleteAccount = async (): Promise<void> => {
    try {
        await axios.delete('/api/user/account');
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};

export const exportUserData = async (): Promise<Blob> => {
    try {
        const response = await axios.get('/api/user/export', {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting user data:', error);
        throw error;
    }
};