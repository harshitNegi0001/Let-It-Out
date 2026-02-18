import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Diary from '../controllers/diaryController.js';

const router = express.Router();

router.get('/get-my-diary',authMiddleware,Diary.getDiaryNotes);

router.post('/create-note',authMiddleware,Diary.createNote);
router.post('/edit-note',authMiddleware,Diary.editNote);

router.post('/delete-note',authMiddleware,Diary.deleteNote);



export default router;