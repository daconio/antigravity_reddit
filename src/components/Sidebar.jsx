import React from 'react';
import { Home, TrendingUp, Star, Gamepad2, Code, Globe } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <h3 className="sidebar-title">Feeds</h3>
                <a href="/" className="sidebar-link active">
                    <Home size={20} />
                    <span>Home</span>
                </a>
                <a href="/popular" className="sidebar-link">
                    <TrendingUp size={20} />
                    <span>Popular</span>
                </a>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-title">Communities</h3>
                <a href="/r/technology" className="sidebar-link">
                    <Code size={20} />
                    <span>r/technology</span>
                </a>
                <a href="/r/gaming" className="sidebar-link">
                    <Gamepad2 size={20} />
                    <span>r/gaming</span>
                </a>
                <a href="/r/worldnews" className="sidebar-link">
                    <Globe size={20} />
                    <span>r/worldnews</span>
                </a>
                <a href="/r/interesting" className="sidebar-link">
                    <Star size={20} />
                    <span>r/interesting</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
