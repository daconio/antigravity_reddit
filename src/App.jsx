import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Community from './pages/Community';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/community/:id" element={<Community />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
