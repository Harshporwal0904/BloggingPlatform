import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState('Unknown');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // We get post details
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
        
        // Since get single post doesn't include author name, we fetch all posts to find author name
        // In a real scenario, the backend /posts/{id} should return author name
        try {
          const allPostsResponse = await api.get('/posts');
          const foundPost = allPostsResponse.data.find(p => p.id === id);
          if (foundPost && foundPost.author) {
            setAuthor(foundPost.author);
          }
        } catch (e) {
          console.error("Failed to fetch author name");
        }
      } catch (err) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <Loader />;

  if (error || !post) {
    return (
      <div className="container">
        <div className="error-msg" style={{marginTop: '2rem', textAlign: 'center'}}>{error || 'Post not found'}</div>
        <div style={{textAlign: 'center', marginTop: '1rem'}}>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString(undefined, { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="container">
      <div className="post-detail card">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span>By <strong>{author}</strong></span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <div className="post-detail-content">
          {post.content}
        </div>
        <div style={{ marginTop: '3rem' }}>
          <Link to="/" className="btn" style={{ border: '1px solid var(--border)' }}>
            &larr; Back to Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
