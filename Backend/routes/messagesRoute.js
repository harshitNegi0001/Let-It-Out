import e from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Messages from '../controllers/messagesController.js'

const router = e.Router();

router.get('/get-my-chatlist',authMiddleware,Messages.getChatlist);

export default router;