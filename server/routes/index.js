import { Router } from "express";
import authRoutes from './auth.js';
import commentRoutes from './comments.js';
import likeRoutes from './likes.js';
import postRoutes from './posts.js';
import userRoutes from './users.js'
import relationRoutes from './relationship.js'


const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/comments', commentRoutes);
router.use('/api/likes', likeRoutes);
router.use('/api/posts', postRoutes);
router.use('/api/users', userRoutes);
router.use('/api/relationships', relationRoutes);

export default router;