import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: String,
        required: true,
        default: 'general'
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            value: {
                type: Number,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create text index for search functionality
postSchema.index({ title: 'text', content: 'text', community: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;
