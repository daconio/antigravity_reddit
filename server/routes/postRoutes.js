import express from 'express';
import { createPost, getPosts, getPostById, deletePost, votePost, searchPosts } from '../controllers/postController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/search')
    .get(searchPosts);

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPostById)
    .delete(protect, deletePost);

router.route('/:id/vote')
    .post(protect, votePost);

export default router;
