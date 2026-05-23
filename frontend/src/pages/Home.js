import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      // Sort by latest
      const sortedPosts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(sortedPosts);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Loader />;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Latest Posts</h1>
      </div>
      
      {error && <div className="error-msg">{error}</div>}
      
      {posts.length === 0 && !error ? (
        <div className="empty-state">
          <h2>No posts found</h2>
          <p>Be the first to create a post!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {currentPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      
      {!loading && !error && posts.length > 0 && (
        <Pagination 
          postsPerPage={postsPerPage} 
          totalPosts={posts.length} 
          paginate={paginate} 
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default Home;
