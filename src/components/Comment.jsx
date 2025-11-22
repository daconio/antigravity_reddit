import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Comment = ({ comment, onReply, postId, depth = 0 }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const { user } = useAuth();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const res = await fetch(`/api/comments/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    content: replyText,
                    parentComment: comment._id
                })
            });

            if (res.ok) {
                setReplyText('');
                setShowReplyForm(false);
                // Refresh the page to show new reply
                window.location.reload();
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const maxDepth = 5; // Limit nesting depth

    return (
        <div className="comment-wrapper" style={{ marginLeft: depth > 0 ? '32px' : '0' }}>
            <div className="comment">
                <div className="comment-avatar"></div>
                <div className="comment-content">
                    <div className="comment-meta">
                        <span className="comment-author">{comment.author?.username || 'unknown'}</span>
                        <span className="comment-time">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                        {user && depth < maxDepth && (
                            <button
                                className="comment-action"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                            >
                                <MessageSquare size={16} />
                                Reply
                            </button>
                        )}
                    </div>

                    {showReplyForm && (
                        <form onSubmit={handleReplySubmit} className="reply-form">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="reply-input"
                                autoFocus
                            />
                            <div className="reply-actions">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyText('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!replyText.trim()}
                                >
                                    Reply
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Recursively render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                    {comment.replies.map(reply => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            onReply={onReply}
                            postId={postId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
