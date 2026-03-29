import express from 'express';
import { getUserProfile, uploadProfilePicture } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import upload from '../config/upload';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/profile/picture', protect, upload.single('image'), uploadProfilePicture);

export default router;
