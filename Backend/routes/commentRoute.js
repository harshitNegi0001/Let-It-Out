import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import Comment from '../controllers/commentController.js';
const router = express.Router();

router.post('/add-comment',authMiddleware,Comment.addComment)

export default router;
