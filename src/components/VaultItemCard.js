"use client";
import React from "react";
import "./VaultItemCard.css";

const VaultItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="vault-item">
      <div className="mb-2">
        <h3>{item.title}</h3>
        <p>{item.username}</p>
      </div>
      <div className="vault-actions">
        <button onClick={onEdit} className="edit-btn">
          Edit
        </button>
        <button onClick={onDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default VaultItemCard;
