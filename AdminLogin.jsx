import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5009/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!data.isAdmin) {
        alert("❌ You are not authorized as admin");
        return;
      }

      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminID", data.userID);

      alert("✅ Admin login successful");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Admin login error", err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      {/* 🔙 Back Button */}
      <button onClick={() => navigate("/")} style={styles.backButton}>
        ← Back
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>🔒 Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1c92d2, #f2fcfe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative", // required for positioning the back button
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#1c92d2",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333333",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    background: "#1c92d2",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    transition: "background 0.3s ease",
  },
};

export default AdminLogin;
