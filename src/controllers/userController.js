import User from '../models/user.js';
import { uploadFileToS3, deleteFileFromS3 } from '../services/storageService.js';

export const getUserProfile = async (req, res) => {
    try {
        console.log('Get profile request for user:', req.user._id);

        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        console.log('User profile fetched:', user);
        res.json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Failed to fetch profile.' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        console.log('Update profile request for user:', req.user._id);
        console.log('Update data:', req.body);

        const allowedUpdates = ['displayName', 'preferences'];
        const updates = {};

        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

       
        if (req.body.preferences) {
            const user = await User.findById(req.user._id);
            updates.preferences = {
                ...user.preferences,
                ...req.body.preferences
            };
        }

        // Update last active timestamp
        updates.lastActive = new Date();

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        console.log('User profile updated:', user);
        res.json(user);
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Failed to update profile.' });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        console.log('Profile image upload request:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded.' });
        }

        // Validate file type
        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: 'File must be an image.' });
        }

        // Validate file size (5MB max)
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: 'Image size must be less than 5MB.' });
        }

        // Generate unique key for profile image
        const key = `profile-images/${req.user._id}/${Date.now()}_${req.file.originalname}`;

        // Upload to S3
        const { url } = await uploadFileToS3(req.file.buffer, key, req.file.mimetype);

        if (!url) {
            return res.status(500).json({ message: 'Failed to upload image.' });
        }

        // Get current user to delete old profile image
        const currentUser = await User.findById(req.user._id);
        const oldImageKey = currentUser.profileImageKey;

        // Update user with new profile image
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    profileImage: url,
                    profileImageKey: key,
                    lastActive: new Date()
                }
            },
            { new: true }
        ).select('-password');

        // Delete old profile image from S3 if exists
        if (oldImageKey) {
            try {
                await deleteFileFromS3(oldImageKey);
                console.log('Old profile image deleted:', oldImageKey);
            } catch (deleteErr) {
                console.warn('Failed to delete old profile image:', deleteErr);
            }
        }

        console.log('Profile image updated:', user.profileImage);
        res.json({ imageUrl: user.profileImage });
    } catch (err) {
        console.error('Error uploading profile image:', err);
        res.status(500).json({ message: 'Failed to upload profile image.' });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        console.log('Delete account request for user:', req.user._id);

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Delete profile image from S3 if exists
        if (user.profileImageKey) {
            try {
                await deleteFileFromS3(user.profileImageKey);
                console.log('Profile image deleted from S3');
            } catch (deleteErr) {
                console.warn('Failed to delete profile image:', deleteErr);
            }
        }

        // Delete all user files (this should be handled by a separate cleanup job in production)
        // For now, we'll just delete the user record
        await User.findByIdAndDelete(req.user._id);

        console.log('User account deleted:', req.user._id);
        res.json({ message: 'Account deleted successfully.' });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ message: 'Failed to delete account.' });
    }
};

export const exportUserData = async (req, res) => {
    try {
        console.log('Export data request for user:', req.user._id);

        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // In a real application, you would also include user files data
        const exportData = {
            profile: user,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="my-syncpad-data.json"');
        res.json(exportData);
    } catch (err) {
        console.error('Error exporting user data:', err);
        res.status(500).json({ message: 'Failed to export data.' });
    }
};