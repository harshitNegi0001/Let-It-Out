import e from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Messages from '../controllers/messagesController.js'

const router = e.Router();

router.get('/get-my-chatlist',authMiddleware,Messages.getChatlist);
router.post('/get-messages',authMiddleware,Messages.getMessages);

router.post('/send-message',authMiddleware,Messages.sendMessage);


export default router;