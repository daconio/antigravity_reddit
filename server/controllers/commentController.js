import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Create a new comment
// @route   POST /api/comments/:postId
// @access  Private
export const createComment = async (req, res) => {
    const { content, parentComment } = req.body;
    const { postId } = req.params;

    if (!content) {
        return res.status(400).json({ message: 'Please add content' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // If parentComment is provided, verify it exists
        if (parentComment) {
            const parentExists = await Comment.findById(parentComment);
            if (!parentExists) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }
        }

        const comment = await Comment.create({
            content,
            post: postId,
            author: req.user.id,
            parentComment: parentComment || null,
        });

        const populatedComment = await Comment.findById(comment._id).populate('author', 'username avatar');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
export const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ post: postId })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the comment author
        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await comment.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
