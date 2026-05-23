import React, { useState } from 'react';

const PostForm = ({ initialData, onSubmit, isLoading, buttonText }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    setError('');
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-msg" style={{marginBottom: '1rem', textAlign: 'left'}}>{error}</div>}
      <div className="input-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          disabled={isLoading}
          maxLength={100}
        />
      </div>
      <div className="input-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          rows={10}
          disabled={isLoading}
        ></textarea>
      </div>
      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={isLoading}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </form>
  );
};

export default PostForm;
