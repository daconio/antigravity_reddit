import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    const { title, content, community } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Please add title and content' });
    }

    try {
        const post = await Post.create({
            title,
            content,
            community: community || 'general',
            author: req.user.id,
        });

        const populatedPost = await Post.findById(post._id).populate('author', 'username avatar');

        res.status(201).json(populatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
export const searchPosts = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        // Try text search first (requires text index)
        let posts = await Post.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        )
            .populate('author', 'username avatar')
            .sort({ score: { $meta: 'textScore' } });

        // If text search returns no results, fall back to regex search
        if (posts.length === 0) {
            const searchRegex = new RegExp(q, 'i');

            // Search in title, content, and community
            const postResults = await Post.find({
                $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                    { community: searchRegex }
                ]
            })
                .populate('author', 'username avatar')
                .sort({ createdAt: -1 });

            // Also search by author username
            const users = await User.find({ username: searchRegex }).select('_id');
            const userIds = users.map(user => user._id);

            const authorResults = await Post.find({
                author: { $in: userIds }
            })
                .populate('author', 'username avatar')
                .sort({ createdAt: -1 });

            // Combine and deduplicate results
            const combinedPosts = [...postResults, ...authorResults];
            const uniquePosts = Array.from(
                new Map(combinedPosts.map(post => [post._id.toString(), post])).values()
            );

            posts = uniquePosts;
        }

        // Calculate score and vote count for each post
        const postsWithScore = posts.map(post => {
            const score = post.votes.reduce((acc, vote) => acc + vote.value, 0);
            return {
                ...post.toObject(),
                score,
                voteCount: post.votes.length
            };
        });

        res.status(200).json(postsWithScore);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        // Calculate score and user vote for each post
        const postsWithScore = posts.map(post => {
            const score = post.votes.reduce((acc, vote) => acc + vote.value, 0);

            // If we had a way to know the current user here (e.g. optional auth), we could add userVote
            // For now, we'll handle userVote in the frontend or separate endpoint if needed
            // But wait, we can't easily get req.user if the route is public and no token is sent.
            // Let's just return the score.

            return {
                ...post.toObject(),
                score,
                voteCount: post.votes.length
            };
        });

        res.status(200).json(postsWithScore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username avatar');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const score = post.votes.reduce((acc, vote) => acc + vote.value, 0);

        res.status(200).json({
            ...post.toObject(),
            score
        });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Vote on a post
// @route   POST /api/posts/:id/vote
// @access  Private
export const votePost = async (req, res) => {
    const { value } = req.body; // 1 for upvote, -1 for downvote
    const { id } = req.params;

    if (![1, -1].includes(value)) {
        return res.status(400).json({ message: 'Invalid vote value' });
    }

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already voted
        const existingVoteIndex = post.votes.findIndex(
            (vote) => vote.user.toString() === req.user.id
        );

        if (existingVoteIndex !== -1) {
            const existingVote = post.votes[existingVoteIndex];

            if (existingVote.value === value) {
                // Toggle off (remove vote)
                post.votes.splice(existingVoteIndex, 1);
            } else {
                // Change vote
                existingVote.value = value;
            }
        } else {
            // Add new vote
            post.votes.push({ user: req.user.id, value });
        }

        await post.save();

        const score = post.votes.reduce((acc, vote) => acc + vote.value, 0);

        // Find user's current vote
        const userVote = post.votes.find(v => v.user.toString() === req.user.id);

        res.status(200).json({
            score,
            userVote: userVote ? userVote.value : 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the post author
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await post.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
