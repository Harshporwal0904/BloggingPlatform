import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PostCard = ({ post, onDelete }) => {
  const { user } = useContext(AuthContext);
  
  const date = new Date(post.created_at).toLocaleDateString();

  return (
    <div className="card post-card">
      <h3 className="post-title">{post.title}</h3>
      <div className="post-meta">
        <span>By {post.author || 'User'}</span> &bull; <span>{date}</span>
      </div>
      <p className="post-content">
        {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
      </p>
      
      <div className="post-actions">
        <Link to={`/posts/${post.id}`} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          Read More
        </Link>
        {user && user.id === post.user_id && (
          <>
            <Link to={`/edit-post/${post.id}`} className="btn" style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
              Edit
            </Link>
            <button 
              onClick={() => onDelete(post.id)} 
              className="btn btn-danger" 
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
