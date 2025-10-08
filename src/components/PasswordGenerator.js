"use client";
import React, { useState } from "react";
import "./PasswordGenerator.css";

const PasswordGenerator = ({ onGenerate, onClose }) => {
  const [length, setLength] = useState(12);
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);

  const generatePassword = () => {
    let chars = "";
    if (includeLetters) chars += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_-+=<>?/{}~";

    if (excludeLookAlikes) chars = chars.replace(/[l1O0]/g, ""); // remove look-alikes
    if (!chars) return "";

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    onGenerate(password);
    onClose();
  };

  return (
    <div className="password-generator-overlay">
      <div className="password-generator-modal">
        <h2>Generate Password</h2>

        <div className="range-container">
          <label>Length: {length}</label>
          <input
            type="range"
            min={6}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={includeLetters}
              onChange={() => setIncludeLetters(!includeLetters)}
            />
            Include Letters
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
            />
            Include Numbers
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
            />
            Include Symbols
          </label>
          <label>
            <input
              type="checkbox"
              checked={excludeLookAlikes}
              onChange={() => setExcludeLookAlikes(!excludeLookAlikes)}
            />
            Exclude Look-Alike Characters (l, 1, O, 0)
          </label>
        </div>

        <div className="modal-actions">
          <button onClick={generatePassword} className="modal-btn generate">
            Generate
          </button>
          <button onClick={onClose} className="modal-btn cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
