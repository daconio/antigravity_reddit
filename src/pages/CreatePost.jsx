import React, { useState } from 'react';
import { Image, Link, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
    const [activeTab, setActiveTab] = useState('post');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [community, setCommunity] = useState('general');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!title || !content) return;

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, content, community })
            });

            if (res.ok) {
                navigate('/');
            } else {
                alert('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    if (!user) {
        return (
            <div className="container">
                <h2>Please login to create a post</h2>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="create-post-header">
                <h2>Create a post</h2>
            </div>

            <div className="create-post-container">
                <div className="community-selector">
                    <select
                        className="community-select"
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                    >
                        <option value="general">r/general</option>
                        <option value="technology">r/technology</option>
                        <option value="gaming">r/gaming</option>
                        <option value="worldnews">r/worldnews</option>
                    </select>
                </div>

                <div className="post-form-card">
                    <div className="post-tabs">
                        <button
                            className={`post-tab ${activeTab === 'post' ? 'active' : ''}`}
                            onClick={() => setActiveTab('post')}
                        >
                            <FileText size={20} />
                            <span>Post</span>
                        </button>
                        <button
                            className={`post-tab ${activeTab === 'image' ? 'active' : ''}`}
                            onClick={() => setActiveTab('image')}
                        >
                            <Image size={20} />
                            <span>Images & Video</span>
                        </button>
                        <button
                            className={`post-tab ${activeTab === 'link' ? 'active' : ''}`}
                            onClick={() => setActiveTab('link')}
                        >
                            <Link size={20} />
                            <span>Link</span>
                        </button>
                    </div>

                    <div className="post-inputs">
                        <input
                            type="text"
                            placeholder="Title"
                            className="post-input-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        {activeTab === 'post' && (
                            <textarea
                                placeholder="Text (optional)"
                                className="post-input-text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                        )}

                        {activeTab === 'image' && (
                            <div className="upload-area">
                                <p>Drag and drop images or <button className="upload-btn">Upload</button></p>
                            </div>
                        )}

                        {activeTab === 'link' && (
                            <input type="text" placeholder="Url" className="post-input-title" />
                        )}
                    </div>

                    <div className="post-form-actions">
                        <button className="btn btn-ghost">Save Draft</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
