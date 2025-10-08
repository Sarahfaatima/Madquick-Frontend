"use client";
import React from "react";
import "./SearchBar.css";

const SearchBar = ({ query, setQuery }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="search-bar"
    />
  );
};

export default SearchBar;
