import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Followers from "../controllers/followerController.js";
const router = express.Router();

router.post('/req-follow',authMiddleware,Followers.requestToFollow);

export default router;