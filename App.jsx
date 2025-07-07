import React, { useState } from "react";
import axios from "axios";
import Shop from "./Shop";
import Brand from "./Brand";
import Contact from "./Contact";
import More from "./More";
import Offer from "./Offer";
import Cart from "./Cart";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ExploreItem from "./ExploreItem";
import styles from "./App.module.css";
import Dashboard from "./Dashboard";
import Terms from "./Terms";
import AdminLogin from "./AdminLogin";
import Admin from "./Admin";
import Landing from "./Landing";
import About from "./About";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// ✅ LoginForm component
function LoginForm({ onLogin }) {
  const [formData, setFormData] = React.useState({
    userID: "",
    password: "",
    email: "",
    mobile: "",
  });
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:5009/login"
      : "http://localhost:5009/signup";

    if (!isLogin) {
      const password = formData.password;
      const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

      if (!strongPasswordRegex.test(password)) {
        alert(
          "Password must be at least 8 characters long, include 1 uppercase letter and 1 special character."
        );
        return;
      }

      const mobilePattern = /^\d{10}$/;
      if (!mobilePattern.test(formData.mobile)) {
        alert("Mobile number must be exactly 10 digits.");
        return;
      }
    }

    try {
      const dataToSend = isLogin
        ? { userID: formData.userID, password: formData.password }
        : formData;

      const res = await axios.post(url, dataToSend);
      alert(`${isLogin ? "Login" : "Signup"} Successful: ${res.data.message}`);
      if (isLogin) {
        localStorage.setItem("loggedInUser", formData.userID);
        onLogin(formData.userID);
        navigate(`/dashboard/${formData.userID}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Server not reachable";
      alert(`${isLogin ? "Login" : "Signup"} Failed: ${msg}`);
    }
  };

  return (
    <div className={styles.page}>
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
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
          zIndex: 1000,
        }}
      >
        ← Back
      </button>

      <div className={styles.leftPanel}></div>
      <div className={styles.rightPanel}>
        <form onSubmit={handleSubmit} className={styles.container}>
          <h2 className={styles.heading}>
            {isLogin ? " UNI CLOTH" : "⭐ Create New Account"}
          </h2>

          <input
            type="text"
            name="userID"
            placeholder="Enter User Name"
            value={formData.userID}
            onChange={handleChange}
            required
            className={styles.input}
          />

          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="📧 Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          )}

          {!isLogin && (
            <input
              type="text"
              name="mobile"
              placeholder="📱 Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
              pattern="\d{10}"
              maxLength="10"
              className={styles.input}
            />
          )}

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {!isLogin && (
            <p style={{ fontSize: "12px", color: "#888", marginTop: "-8px" }}>
              🔒 Must be 8+ characters, 1 capital letter & 1 special character
            </p>
          )}

          <button type="submit" className={styles.button}>
            {isLogin ? " Login" : "✅ Signup"}
          </button>

          <p className={styles.toggleText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: "#3498db", cursor: "pointer", marginLeft: 5 }}
            >
              {isLogin ? "Create One" : "Login"}
            </span>
          </p>

          {isLogin && (
            <p style={{ marginTop: "10px", textAlign: "right" }}>
              <span
                onClick={() => navigate("/forgot-password")}
                style={{
                  color: "#e74c3c",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Forgot Password?
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// ✅ DashboardWrapper to extract :userID from URL
function DashboardWrapper({ onLogout }) {
  const { userID } = useParams();
  return <Dashboard userID={userID} onLogout={onLogout} />;
}

// ✅ AppRoutes component
function AppRoutes({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard/:userID"
        element={<DashboardWrapper onLogout={handleLogout} />}
      />
      <Route path="/login" element={<LoginForm onLogin={setLoggedInUser} />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/shop/:userID" element={<Shop />} />
      <Route path="/offer/:userID" element={<Offer />} />
      <Route path="/brand/:userID" element={<Brand />} />
      <Route path="/contact/:userID" element={<Contact />} />
      <Route path="/explore/:userID" element={<ExploreItem />} />
      <Route path="/cart/:userID" element={<Cart />} />
      <Route path="/more" element={<More />} />
      <Route path="/brand" element={<Brand />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/terms/:userID" element={<Terms />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

// ✅ Main App component
function App() {
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("loggedInUser")
  );

  return (
    <Router>
      <AppRoutes
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    </Router>
  );
}

export default App;
