import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Diary from '../controllers/diaryController.js';

const router = express.Router();

router.get('/get-my-diary',authMiddleware,Diary.getDiaryNotes);



export default router;