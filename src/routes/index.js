import express from 'express';
import textRoutes from './textRoutes.js';
import authRoutes from './authRoutes.js';
import fileRoutes from './fileRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();
router.get('/', (req, res) => {
    res.json({message: "Welcome to syncpad now please go back"});
});
router.use('/text', textRoutes);
router.use('/files', fileRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);


export default router;