import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts/my-posts');
      const sortedPosts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(sortedPosts);
    } catch (err) {
      setError('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        setPosts(posts.filter(post => post.id !== id));
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Posts</h1>
        <Link to="/create-post" className="btn btn-primary">
          Create New Post
        </Link>
      </div>
      
      {error && <div className="error-msg">{error}</div>}
      
      {posts.length === 0 && !error ? (
        <div className="empty-state">
          <h2>You haven't created any posts yet</h2>
          <p>Get started by creating your first post!</p>
          <Link to="/create-post" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Post
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={{...post, author: 'You'}} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
