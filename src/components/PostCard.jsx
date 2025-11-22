import React, { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post }) => {
    const [score, setScore] = useState(post.score || 0);
    const [userVote, setUserVote] = useState(post.userVote || 0); // 0, 1, -1
    const { user } = useAuth();

    const handleVote = async (value) => {
        if (!user) {
            alert('Please login to vote');
            return;
        }

        // Optimistic update
        let newScore = score;
        let newVote = value;

        if (userVote === value) {
            // Toggle off
            newVote = 0;
            newScore -= value;
        } else {
            // Change vote
            newScore = score - userVote + value;
        }

        setScore(newScore);
        setUserVote(newVote);

        try {
            const res = await fetch(`/api/posts/${post._id}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ value })
            });

            if (!res.ok) {
                // Revert on error
                setScore(score);
                setUserVote(userVote);
            }
        } catch (error) {
            console.error('Vote error:', error);
            setScore(score);
            setUserVote(userVote);
        }
    };

    return (
        <div className="post-card">
            <div className="post-votes">
                <button
                    className={`vote-btn up ${userVote === 1 ? 'active' : ''}`}
                    onClick={() => handleVote(1)}
                >
                    <ArrowBigUp size={24} fill={userVote === 1 ? "currentColor" : "none"} />
                </button>
                <span className={`vote-count ${userVote === 1 ? 'up' : userVote === -1 ? 'down' : ''}`}>
                    {score}
                </span>
                <button
                    className={`vote-btn down ${userVote === -1 ? 'active' : ''}`}
                    onClick={() => handleVote(-1)}
                >
                    <ArrowBigDown size={24} fill={userVote === -1 ? "currentColor" : "none"} />
                </button>
            </div>

            <div className="post-content">
                <div className="post-meta">
                    <div className="subreddit-icon"></div>
                    <span className="subreddit-name">r/{post.community}</span>
                    <span className="post-author">Posted by u/{post.author?.username || 'unknown'}</span>
                    <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <Link to={`/post/${post._id}`} className="post-title-link">
                    <h3 className="post-title">{post.title}</h3>
                </Link>

                {post.image && (
                    <div className="post-image-container">
                        <img src={post.image} alt={post.title} className="post-image" />
                    </div>
                )}

                {post.content && <p className="post-text">{post.content.substring(0, 200)}...</p>}

                <div className="post-actions">
                    <Link to={`/post/${post._id}`} className="action-btn">
                        <MessageSquare size={20} />
                        <span>{post.voteCount || 0} Comments</span>
                    </Link>
                    <button className="action-btn">
                        <Share2 size={20} />
                        <span>Share</span>
                    </button>
                    <button className="action-btn">
                        <Bookmark size={20} />
                        <span>Save</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
