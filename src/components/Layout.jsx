import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Navbar />
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
