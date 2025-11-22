import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Comment from '../components/Comment';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    fetch(`/api/posts/${id}`),
                    fetch(`/api/comments/${id}`)
                ]);

                if (postRes.ok) {
                    const postData = await postRes.json();
                    setPost(postData);
                }

                if (commentsRes.ok) {
                    const commentsData = await commentsRes.json();
                    setComments(commentsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmitComment = async (e, parentCommentId = null) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    content: newComment,
                    parentComment: parentCommentId
                })
            });

            if (res.ok) {
                const savedComment = await res.json();
                setComments([savedComment, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    // Organize comments into a tree structure
    const organizeComments = (comments) => {
        const commentMap = {};
        const rootComments = [];

        // First pass: create a map of all comments
        comments.forEach(comment => {
            commentMap[comment._id] = { ...comment, replies: [] };
        });

        // Second pass: organize into tree
        comments.forEach(comment => {
            if (comment.parentComment) {
                // This is a reply
                if (commentMap[comment.parentComment]) {
                    commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
                }
            } else {
                // This is a top-level comment
                rootComments.push(commentMap[comment._id]);
            }
        });

        return rootComments;
    };

    const organizedComments = organizeComments(comments);

    if (loading) return <div className="container">Loading...</div>;
    if (!post) return <div className="container">Post not found</div>;

    return (
        <div className="container">
            <PostCard post={post} />

            <div className="comments-section">
                <div className="comments-header">
                    <h3>Comments</h3>
                </div>

                {user ? (
                    <form onSubmit={handleSubmitComment} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="What are your thoughts?"
                            className="comment-input"
                        />
                        <div className="comment-actions-right">
                            <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>
                                Comment
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="login-prompt">
                        <p>Log in to comment</p>
                    </div>
                )}

                <div className="comment-list">
                    {organizedComments.map(comment => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onReply={handleSubmitComment}
                            postId={id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
