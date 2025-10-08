"use client";
import React, { useState } from "react";
import VaultList from "../components/VaultList";
import VaultModal from "../components/VaultModal";
import SearchBar from "../components/SearchBar";
import "../pages/vault.css"; // Import the new CSS
import { handleSuccess} from "../utils/utils";

const VaultPage = () => {
  const [vaultItems, setVaultItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleSave = async (item) => {
    try {
      const payload = selectedItem ? { ...item, _id: selectedItem._id } : item;
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/save-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) {
        console.error("Failed to save:", result.message);
        return;
      }
      setIsModalOpen(false);
      fetchVaultItems();
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const fetchVaultItems = async () => {
    try {
      setVaultItems([]); // Clear existing items before fetching
      console.log("Fetching vault items...");
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/fetch-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      console.log("Response status:", res.status);
      console.log("Response headers:", res);
      if (!res.ok) throw new Error("Failed to fetch vault items");
      const data = await res.json();
      setVaultItems(data);
    } catch (err) {
      console.error("Error fetching vault items:", err);
    }
  };
  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Loggedout");
    window.location.href = "/login";
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8080/api/delete?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      fetchVaultItems();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const filteredItems = vaultItems.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="vault-page">
      <header className="vault-header">
        <h1>Vault</h1>
        <div className="header-actions">
          <button className="vault-btn refresh" onClick={fetchVaultItems}>
            Refresh
          </button>
          <button className="vault-btn" onClick={handleAdd}>
            + Add
          </button>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          <button
            className="vault-btn logout"
            onClick={handleLogout}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      <VaultList
        items={filteredItems}
        onEdit={(item) => {
          setSelectedItem(item);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <VaultModal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default VaultPage;
