import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./App.module.css";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5009/reset-password/${token}`,
        { newPassword }
      );
      setMsg(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.container}>
        <h2 className={styles.heading}>🔄 Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className={styles.input}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Update Password
        </button>
        {msg && (
          <p
            style={{
              color: msg.includes("updated") ? "green" : "red",
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
