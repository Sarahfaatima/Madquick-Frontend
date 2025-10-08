"use client";
import React from "react";
import CryptoJS from "crypto-js";
import "./VaultList.css";

const ENCRYPTION_KEY = "my_super_secret_key_123!";

const decrypt = (cipher) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decryption error:", err);
    return "";
  }
};

export default function VaultList({ items = [], onEdit, onDelete }) {
  if (!items.length)
    return <p className="vault-empty">No saved items yet.</p>;

  return (
    <div className="vault-table-container">
      <table className="vault-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Username</th>
            <th>Password</th>
            <th>URL</th>
            <th>Notes</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const title = item.title ? decrypt(item.title) : "";
            const username = item.username ? decrypt(item.username) : "";
            const password = item.password ? decrypt(item.password) : "";
            const url = item.url ? decrypt(item.url) : "";
            const notes = item.notes ? decrypt(item.notes) : "";

            return (
              <tr key={item._id}>
                <td>{title}</td>
                <td>{username}</td>
                <td>{password}</td>
                <td>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{notes || "-"}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => onEdit(item)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
