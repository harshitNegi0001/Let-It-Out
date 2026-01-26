import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Followers from "../controllers/followerController.js";
import Block from '../controllers/blockController.js';
const router = express.Router();

router.post('/req-follow',authMiddleware,Followers.requestToFollow);
router.post('/handle-follow-req',authMiddleware,Followers.handleFollowReq)

router.get('/get-connection-list',authMiddleware,Followers.getConnectivityList);

router.get('/get-my-blocked-acc',authMiddleware,Block.getBlockedAcc);
router.post('/block-user',authMiddleware,Block.blockUnblockUser);


export default router;