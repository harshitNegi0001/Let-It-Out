import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import UserProfile from '../controllers/userProfileController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/upload/image',authMiddleware,upload.single('image'),UserProfile.uploadImage);

router.post('/update/my-profile',authMiddleware,UserProfile.updateProfile);
router.post('/setup/my-profile',authMiddleware,UserProfile.setupNewUser);

router.post('/change-privacy',authMiddleware,UserProfile.changePrivacy);

export default router;