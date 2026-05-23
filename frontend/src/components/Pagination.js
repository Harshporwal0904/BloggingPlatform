import React from 'react';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) {
    return null;
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '0.5rem' }}>
        {pageNumbers.map(number => (
          <li key={number}>
            <button 
              onClick={() => paginate(number)} 
              className={`btn ${currentPage === number ? 'btn-primary' : ''}`}
              style={{ 
                border: currentPage !== number ? '1px solid var(--border)' : 'none',
                minWidth: '2.5rem'
              }}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
