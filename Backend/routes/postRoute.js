import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import Post from '../controllers/postsControllers.js';

const router = express.Router();

router.post('/create-post',authMiddleware,upload.array('images', 5),Post.createPost);

router.get('/post/profile',authMiddleware,Post.getProfilePost);
router.get('/get-posts',authMiddleware,Post.getPosts)

router.post('/delete-post',authMiddleware,Post.deleteMyPost);


export default router;
