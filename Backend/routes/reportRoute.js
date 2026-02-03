import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
import Report from '../controllers/reportController.js';

const router = express.Router();

router.post('/add-report',authMiddleware,Report.addReport);

export default router;