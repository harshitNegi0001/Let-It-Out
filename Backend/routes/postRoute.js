import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import Post from '../controllers/postsControllers.js';

const router = express.Router();

router.post('/create-post',authMiddleware,upload.array('images', 5),Post.createPost);

router.get('/post/profile',authMiddleware,Post.getProfilePost);
router.get('/get-posts',authMiddleware,Post.getPosts);
router.get('/get-activity-posts',authMiddleware,Post.getActivityPosts);

router.post('/delete-post',authMiddleware,Post.deleteMyPost);

router.post('/save-post',authMiddleware,Post.savePost);
router.post('/undo-save-post',authMiddleware,Post.undoSavePost);

router.get('/get-post-info',authMiddleware,Post.getPostInfo);



export default router;
