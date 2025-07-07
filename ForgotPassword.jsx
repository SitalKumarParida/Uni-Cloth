// ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import styles from "./App.module.css";

export default function ForgotPassword() {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5009/forgot-password", {
        userID,
        email,
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.container}>
        <h2 className={styles.heading}>🔑 Forgot Password</h2>
        <input
          type="text"
          placeholder="User ID"
          className={styles.input}
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Registered Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Send Reset Link
        </button>
        {msg && (
          <p
            style={{
              color: msg.includes("sent") ? "green" : "red",
              marginTop: 10,
            }}
          >
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}
