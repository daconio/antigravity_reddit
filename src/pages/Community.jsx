import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

const Community = () => {
    const { id } = useParams(); // community name from URL
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunityPosts = async () => {
            try {
                // Fetch all posts and filter by community
                const res = await fetch('/api/posts');
                const data = await res.json();

                // Filter posts by community
                const communityPosts = data.filter(post => post.community === id);
                setPosts(communityPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunityPosts();
    }, [id]);

    if (loading) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="community-page">
            <div className="community-banner" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>

            <div className="community-header-container">
                <div className="container">
                    <div className="community-header">
                        <div className="community-icon-large" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        </div>
                        <div className="community-info">
                            <h1 className="community-title">r/{id}</h1>
                            <span className="community-name">r/{id}</span>
                        </div>
                        <button className="btn btn-primary join-btn">Join</button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="community-content">
                    <div className="feed-list">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))
                        ) : (
                            <div className="no-posts">
                                <p>No posts in this community yet. Be the first to post!</p>
                            </div>
                        )}
                    </div>

                    <div className="community-sidebar">
                        <div className="card">
                            <h3 className="sidebar-card-title">About Community</h3>
                            <p className="community-description">
                                Welcome to r/{id}! This is a community for discussing {id}-related topics.
                            </p>
                            <div className="community-stats">
                                <div className="stat">
                                    <span className="stat-value">{posts.length}</span>
                                    <span className="stat-label">Posts</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">-</span>
                                    <span className="stat-label">Members</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
