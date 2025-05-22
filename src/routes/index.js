import express from 'express';
import textRoutes from './textRoutes.js';
import fileRoutes from './fileRoutes.js';

const router = express.Router();

router.use('/text', textRoutes);
router.use('/file', fileRoutes);

export default router;