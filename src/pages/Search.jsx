import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const searchPosts = async () => {
            if (!query || query.trim() === '') {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to search posts');
                }

                setPosts(data);
            } catch (error) {
                console.error('Error searching posts:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        searchPosts();
    }, [query]);

    if (loading) {
        return <div className="container">Loading...</div>;
    }

    if (!query || query.trim() === '') {
        return (
            <div className="container">
                <div className="feed-header">
                    <h2 className="feed-title">Search</h2>
                </div>
                <div className="empty-state">
                    <p>Enter a search query to find posts</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="feed-header">
                    <h2 className="feed-title">Search Results for "{query}"</h2>
                </div>
                <div className="empty-state">
                    <p style={{ color: 'var(--error)' }}>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="feed-header">
                <h2 className="feed-title">Search Results for "{query}"</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Found {posts.length} {posts.length === 1 ? 'result' : 'results'}
                </p>
            </div>
            {posts.length === 0 ? (
                <div className="empty-state">
                    <p>No posts found matching your search</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Try different keywords or check your spelling
                    </p>
                </div>
            ) : (
                <div className="feed-list">
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
