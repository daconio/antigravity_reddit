import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Plus, User, Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <button className="icon-btn mobile-menu">
                    <Menu size={24} />
                </button>
                <Link to="/" className="logo">
                    <div className="logo-icon"></div>
                    <span className="logo-text">reddit<span className="highlight">clone</span></span>
                </Link>
            </div>

            <div className="nav-search">
                <div className="search-wrapper">
                    <Search
                        size={20}
                        className="search-icon"
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                    />
                    <input
                        type="text"
                        placeholder="Search Reddit"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                    />
                </div>
            </div>

            <div className="nav-right">
                {user ? (
                    <>
                        <Link to="/create-post" className="icon-btn" title="Create Post">
                            <Plus size={24} />
                        </Link>
                        <button className="icon-btn">
                            <MessageSquare size={24} />
                        </button>
                        <button className="icon-btn">
                            <Bell size={24} />
                        </button>
                        <div className="user-menu">
                            <button className="user-btn">
                                <div className="user-avatar">
                                    <User size={20} />
                                </div>
                                <div className="user-info">
                                    <span className="username">{user.username}</span>
                                    <span className="karma">1 karma</span>
                                </div>
                            </button>
                            <button onClick={handleLogout} className="icon-btn" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="btn btn-ghost">Log In</Link>
                        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
