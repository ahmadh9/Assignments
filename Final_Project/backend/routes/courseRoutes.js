// routes/courseRoutes.js
import express from 'express';
import { createCourse } from '../controllers/courseController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// فقط للمدرسين
router.post('/', authenticateToken, authorizeRoles('instructor'), createCourse);

export default router;
