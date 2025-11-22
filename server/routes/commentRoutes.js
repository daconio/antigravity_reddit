import express from 'express';
import { createComment, getCommentsByPost, deleteComment } from '../controllers/commentController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:postId')
    .get(getCommentsByPost)
    .post(protect, createComment);

router.route('/:id')
    .delete(protect, deleteComment);

export default router;
