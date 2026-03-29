import express from 'express';
import { suggestTasks } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/suggest-tasks', protect, suggestTasks);

export default router;
