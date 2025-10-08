import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import VaultPage from "./pages/vault";
import RefreshHandler from "./RefreshHandler";
import PrivateRoute from "./components/PrivateRoute"; // ✅ import
import { useState } from "react";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />

        {/* ✅ Protected routes wrapper */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<VaultPage />} />
          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
