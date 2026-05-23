import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import PostForm from '../components/PostForm';
import Loader from '../components/Loader';

const EditPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch post or post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError('');
      await api.put(`/posts/${id}`, data);
      navigate('/my-posts');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update post');
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (error && !post) {
    return (
      <div className="container">
        <div className="error-msg" style={{marginTop: '2rem', textAlign: 'center'}}>{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Edit Post</h1>
      </div>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && <div className="error-msg" style={{marginBottom: '1rem'}}>{error}</div>}
        <PostForm 
          initialData={{ title: post.title, content: post.content }} 
          onSubmit={handleSubmit} 
          isLoading={submitting} 
          buttonText="Save Changes" 
        />
      </div>
    </div>
  );
};

export default EditPost;
