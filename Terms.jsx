import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Terms.css";

function Terms() {
  const { userID } = useParams();
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      <div className="terms-container">
        {/* 🏠 Go to Home Button */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
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

        <h1 className="terms-header">Terms & Conditions</h1>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>UNI CLOTH</strong>. These Terms & Conditions
            govern your access and use of our website. By using this site, you
            agree to comply with all the terms outlined below.
          </p>
        </section>

        <section>
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old or visiting the site under the
            supervision of a parent or guardian.
          </p>
        </section>

        <section>
          <h2>3. User Account & Responsibilities</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their
            account credentials and restricting access to their devices.
          </p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            All content on this site including images, graphics, logos, and text
            is the property of FASHIONO or its partners. Unauthorized use is
            strictly prohibited.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            FASHIONO will not be liable for any indirect, incidental, or
            consequential damages arising from your use of the site.
          </p>
        </section>

        <section>
          <h2>6. Termination</h2>
          <p>
            We reserve the right to terminate your access to the website if you
            violate any of the terms mentioned herewith.
          </p>
        </section>

        <section>
          <h2>7. Changes to Terms</h2>
          <p>
            We may modify these Terms & Conditions at any time without notice.
            It is your responsibility to review them periodically.
          </p>
        </section>

        <section className="contact-info">
          <p>
            For any queries, please contact us at:{" "}
            <a href="mailto:unicloth@gmail.com">unicloth@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Terms;
