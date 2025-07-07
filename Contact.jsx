import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Contact.css"; // optional: for external CSS

function Contact() {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter a message!");
      return;
    }

    try {
      await axios.post("http://localhost:5009/api/message", {
        userID,
        message,
        submittedAt: new Date().toISOString(),
      });

      setStatus("✅ Message sent successfully!");
      setMessage("");
    } catch (err) {
      setStatus("❌ Failed to send message");
      console.error(err);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-box">
        <h2>📩 Contact Customer Support</h2>
        <p>
          Have any questions, feedback or concerns? Feel free to send us a
          message and we’ll get back to you shortly.
        </p>

        {/* 🏠 Go to Home Button */}
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button
            onClick={() => navigate(`/dashboard/${userID}`)}
            style={{
              padding: "10px 24px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Go to Home
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <textarea
            rows="6"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">Send Message</button>
        </form>

        {status && <p className="contact-status">{status}</p>}
      </div>
    </div>
  );
}

export default Contact;
