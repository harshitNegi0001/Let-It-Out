import express from 'express';
import Auth from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import Notification from '../controllers/notificationController.js';
const router = express.Router();

router.post('/login',Auth.userLogin);
router.post('/logout',authMiddleware,Auth.logout);


router.get('/google-login',Auth.googleLogin);
router.get('/google/fallback',Auth.googleFallback);

router.post('/change-password',authMiddleware,Auth.changePass);

router.post('/deactivate-my-account',authMiddleware,Auth.deactivateAccount);
router.get('/reactivate-my-account',authMiddleware,Auth.reactivateAccount);
router.post('/delete-my-account',authMiddleware,Auth.deleteAccount);


router.get('/me',authMiddleware,Auth.getMe);
router.get('/get-notifications',authMiddleware,Notification.getNotification);




export default router;