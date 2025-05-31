// routes/userRoutes.js
import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser); 

router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);
export default router;
