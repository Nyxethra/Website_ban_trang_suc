import React, { useState } from 'react';

const Header = () => {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    // Handle search logic here
  };

  return (
    <div className="search-box">
      <input
        type="text"
        className="search-input"
        placeholder="Bạn tìm gì..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <button className="search-button" onClick={handleSearch}>
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default Header; 