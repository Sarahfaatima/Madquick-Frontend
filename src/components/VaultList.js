"use client";
import React, { useState } from "react";
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

export default function VaultList({ items = [], onEdit, onDelete, query = "" }) {
  const [copiedId, setCopiedId] = useState(null);
  
  // Filter items based on search query
  const filteredItems = items.filter(item => {
    if (!query) return true; // If no query, show all items
    
    // Decrypt item fields for searching
    const title = item.title ? decrypt(item.title).toLowerCase() : "";
    const username = item.username ? decrypt(item.username).toLowerCase() : "";
    const url = item.url ? decrypt(item.url).toLowerCase() : "";
    const notes = item.notes ? decrypt(item.notes).toLowerCase() : "";
    
    // Convert query to lowercase for case-insensitive search
    const searchQuery = query.toLowerCase();
    
    // Check if any field contains the search query
    return (
      title.includes(searchQuery) ||
      username.includes(searchQuery) ||
      url.includes(searchQuery) ||
      notes.includes(searchQuery)
    );
  });
  
  const copyToClipboard = (text, itemId) => {
    // Store the timestamp when the password was copied
    const copyTimestamp = Date.now();
    
    // Create a secure random string to replace the password
    const generateSecureRandom = () => {
      const array = new Uint32Array(10);
      window.crypto.getRandomValues(array);
      return Array.from(array, x => x.toString(36)).join('');
    };
    
    // Function to effectively clear the system clipboard
    const clearSystemClipboard = () => {
      // Generate a very long random string (different from the password)
      const randomString = generateSecureRandom() + generateSecureRandom();
      
      // Create multiple different strings to overwrite clipboard multiple times
      const emptyString = '';
      const spaceString = ' ';
      const newlineString = '\n';
      
      // Create a sequence of clipboard overwrites with different content
      // This helps ensure the clipboard is truly cleared across applications
      const overwriteSequence = [
        randomString,  // First overwrite with random data
        spaceString,   // Then a space
        newlineString, // Then a newline
        emptyString    // Finally empty string
      ];
      
      // Execute the sequence with small delays between each write
      let index = 0;
      
      const executeNextOverwrite = () => {
        if (index < overwriteSequence.length) {
          const currentString = overwriteSequence[index];
          
          // Try both clipboard API methods
          try {
            // Method 1: Modern Clipboard API
            navigator.clipboard.writeText(currentString)
              .catch(() => {
                // Method 2: Fallback to execCommand
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = currentString;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
              });
          } catch (err) {
            console.error('Error in clipboard clearing sequence:', err);
          }
          
          // Move to next string in sequence
          index++;
          
          // Small delay between overwrites
          setTimeout(executeNextOverwrite, 50);
        }
      };
      
      // Start the overwrite sequence
      executeNextOverwrite();
    };
    
    // Copy the password to clipboard
    const copyPassword = async () => {
      try {
        // Try using the Clipboard API first
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // Fallback to execCommand
        try {
          const tempTextArea = document.createElement('textarea');
          tempTextArea.value = text;
          tempTextArea.style.position = 'fixed';
          tempTextArea.style.left = '-999999px';
          tempTextArea.style.top = '-999999px';
          document.body.appendChild(tempTextArea);
          tempTextArea.focus();
          tempTextArea.select();
          const success = document.execCommand('copy');
          document.body.removeChild(tempTextArea);
          return success;
        } catch (err) {
          console.error('Failed to copy: ', err);
          return false;
        }
      }
    };

    // Execute the copy operation
    copyPassword().then(success => {
      if (success) {
        setCopiedId(itemId);
        
        // No notification before clearing clipboard
        setTimeout(() => {
          // Do nothing, just wait for the clipboard to be cleared
        }, 10000);
        
        // Clear system clipboard after 15 seconds
        setTimeout(() => {
          // Clear the clipboard using our robust method
          clearSystemClipboard();
          
          // Reset the copied status
          setCopiedId(null);
          
          console.log('System clipboard cleared after 15 seconds');
        }, 15000);
        
        // Add a document-wide paste interceptor for our app
        const pasteHandler = (e) => {
          // If 15 seconds have passed since copying
          if (Date.now() - copyTimestamp > 15000) {
            // Prevent paste operation in our app
            e.preventDefault();
            e.stopPropagation();
            alert('For security reasons, the password has been cleared from clipboard.');
            return false;
          }
        };
        
        // Add the paste event listener
        document.addEventListener('paste', pasteHandler, true);
        
        // Remove the paste event listener after 30 seconds
        setTimeout(() => {
          document.removeEventListener('paste', pasteHandler, true);
        }, 30000);
      }
    });
  };

  if (!items.length)
    return <p className="vault-empty">No saved items yet.</p>;
    
  if (!filteredItems.length)
    return <p className="vault-empty">No matching results found.</p>;

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
          {filteredItems.map((item) => {
            const title = item.title ? decrypt(item.title) : "";
            const username = item.username ? decrypt(item.username) : "";
            const password = item.password ? decrypt(item.password) : "";
            const url = item.url ? decrypt(item.url) : "";
            const notes = item.notes ? decrypt(item.notes) : "";
            const isCopied = copiedId === item._id;

            return (
              <tr key={item._id}>
                <td>{title}</td>
                <td>{username}</td>
                <td>
                  <div className="password-container">
                    <span>{password}</span>
                    <button 
                      className={`copy-btn ${isCopied ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(password, item._id)}
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </td>
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
