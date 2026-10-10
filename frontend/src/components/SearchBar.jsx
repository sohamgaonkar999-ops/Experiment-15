import React from 'react';

// Search box used by all three modules (customers, vehicles, services)
export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value !== '' && (
        <button className="btn btn-light" onClick={() => onChange('')}>
          Clear
        </button>
      )}
    </div>
  );
}