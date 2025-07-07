import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // redirects to Landing.jsx
  };

  return (
    <div className="about-container">
      {/* 🔙 Back Button */}
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>

      <div className="about-header">
        <h1>About UniCloth</h1>
        <p>Empowering fashion through technology</p>
      </div>

      <div className="about-content">
        <p>
          <strong>UniCloth</strong> is a modern e-commerce platform focused on
          making fashion accessible, stylish, and seamless. Founded by{" "}
          <strong>Sital Kumar Parida</strong> and <strong>Sudeep</strong>,
          UniCloth blends trendy design with intuitive tech to redefine how
          users shop online.
        </p>

        <p>
          We offer a curated range of fashion wear for men and women — from
          elegant apparel to comfortable casuals and trendy footwear. Our goal
          is to deliver high-quality products with a smooth and secure shopping
          experience.
        </p>

        <p>
          The platform features user accounts, personalized dashboards, admin
          management, product browsing, and secure order processing — all built
          with performance and usability in mind.
        </p>

        <div className="founders-list">
          <h2>Founders</h2>
          <ul>
            <li>
              <strong>Sital Kumar Parida</strong> – Co-Founder & Developer
            </li>
            <li>
              <strong>Sudeep</strong> – Co-Founder & Developer
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
