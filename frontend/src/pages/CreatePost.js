import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostForm from '../components/PostForm';

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await api.post('/posts', data);
      navigate('/my-posts');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create post');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Create New Post</h1>
      </div>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && <div className="error-msg" style={{marginBottom: '1rem'}}>{error}</div>}
        <PostForm onSubmit={handleSubmit} isLoading={loading} buttonText="Publish Post" />
      </div>
    </div>
  );
};

export default CreatePost;
