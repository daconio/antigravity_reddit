import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts');
                const data = await res.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="container">
            <div className="feed-header">
                <h2 className="feed-title">Popular Posts</h2>
            </div>
            <div className="feed-list">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Home;
