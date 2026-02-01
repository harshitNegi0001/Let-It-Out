import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import Comment from '../controllers/commentController.js';
const router = express.Router();

router.post('/add-comment',authMiddleware,Comment.addComment);
router.get('/get-comments',authMiddleware,Comment.getComments);

router.post('/del-comment',authMiddleware,Comment.deleteComment);

export default router;
