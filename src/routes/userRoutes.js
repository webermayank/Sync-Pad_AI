import express from 'express';
import User from '../models/user.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { uploadProfileImage } from '../controllers/userController.js';

const router = express.Router();
const upload = multer();

router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//patch user profile

router.patch('/profile', protect, async (req, res) => {
    try {
        const updates = req.body;
        // Prevent email/password update here for security, unless you want to handle them
        delete updates.email;
        delete updates.password;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/profile/image',protect,upload.single('image'),uploadProfileImage);

export default router;
