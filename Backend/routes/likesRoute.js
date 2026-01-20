import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import Likes from '../controllers/likesController.js';

const router = express.Router();

router.post('/like-target',authMiddleware,Likes.likeTarget);
router.post('/del-like-target',authMiddleware,Likes.deleteLikeTarget);

export default router;