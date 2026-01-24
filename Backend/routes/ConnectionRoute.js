import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Followers from "../controllers/followerController.js";
const router = express.Router();

router.post('/req-follow',authMiddleware,Followers.requestToFollow);

router.get('/get-connection-list',authMiddleware,Followers.getConnectivityList);

export default router;