"use client";
import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import PasswordGenerator from "./PasswordGenerator";
import "./VaultModal.css";

const ENCRYPTION_KEY = "my_super_secret_key_123!";

const VaultModal = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
    _id: null,
  });

  const [showGenerator, setShowGenerator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title ? decrypt(item.title) : "",
        username: item.username ? decrypt(item.username) : "",
        password: item.password ? decrypt(item.password) : "",
        url: item.url ? decrypt(item.url) : "",
        notes: item.notes ? decrypt(item.notes) : "",
        _id: item._id,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  };

  const decrypt = (cipher) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return "";
    }
  };

  const handleSubmit = () => {
    const encryptedItem = {
      ...form,
      title: encrypt(form.title),
      username: encrypt(form.username),
      password: encrypt(form.password),
      url: encrypt(form.url || ""),
      notes: encrypt(form.notes || ""),
    };
    onSave(encryptedItem);
  };

  const handleGenerate = (password) => {
    setForm({ ...form, password });
  };

  return (
    <div className="vault-modal-overlay">
      <div className="vault-modal">
        <h3>{item ? "Edit Entry" : "Add New Entry"}</h3>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <div className="vault-password-container">
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password-btn"
          >
            {showPassword ? "👁️‍🗨️" : "👁️"}
          </button>
          <button
            type="button"
            onClick={() => setShowGenerator(true)}
            className="generate-btn"
          >
            ⚙️
          </button>
        </div>

        <input
          name="url"
          placeholder="URL"
          value={form.url}
          onChange={handleChange}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="modal-btn save" onClick={handleSubmit}>
            Save
          </button>
          <button className="modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      {showGenerator && (
        <PasswordGenerator
          onGenerate={handleGenerate}
          onClose={() => setShowGenerator(false)}
        />
      )}
    </div>
  );
};

export default VaultModal;
