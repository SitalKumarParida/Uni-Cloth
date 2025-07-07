import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { brands, newArrivals } from "./Data";
import axios from "axios";
import { adImages, heroImages } from "./Dashboarditem";

function Dashboard({ userID, onLogout }) {
  const [cartItems, setCartItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const [email, setEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  const cartKey = `cart_${userID}`;

  useEffect(() => {
    const stored = localStorage.getItem(cartKey);
    setCartItems(stored ? JSON.parse(stored) : []);
  }, [cartKey]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5009/api/address/${userID}`
        );
        setUserInfo(res.data || {});
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserInfo();
  }, [userID]);

  const handleAddToCart = (product) => {
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5009/api/subscribe", {
        email,
      });
      setNewsletterMsg(res.data.message);
      setEmail("");
    } catch (err) {
      if (err.response?.status === 409) {
        setNewsletterMsg("❗ Email already subscribed");
      } else {
        setNewsletterMsg("❌ Subscription failed");
      }
    }

    setTimeout(() => setNewsletterMsg(""), 4000);
  };

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentHeroIndex((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(sliderInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) =>
        prevIndex === adImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">FASHIONO</div>
        <nav className="dashboard-nav">
          <ul>
            <li>
              <Link to={`/shop/${userID}`}>Shop</Link>
            </li>
            <li>
              <Link to={`/brand/${userID}`}>Shoes</Link>
            </li>
            <li>
              <Link to={`/contact/${userID}`}>Contact</Link>
            </li>
            <li>
              <Link to={`/terms/${userID}`}>Terms & Conditions</Link>
            </li>
          </ul>
        </nav>

        <div className="dashboard-user-actions">
          <button
            style={{
              marginRight: "10px",
              fontWeight: "bold",
              background: "none",
              border: "none",
              color: "#333",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => setShowUserDetails(!showUserDetails)}
          >
            Hi, {userID}
          </button>

          {showUserDetails && userInfo && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: "120px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                zIndex: 999,
                minWidth: "240px",
                textAlign: "left",
              }}
            >
              <p>
                <strong>👤 Name:</strong> {userInfo.fullName || userID}
              </p>

              <p>
                <strong>📍 Address:</strong>
              </p>
              <p style={{ marginLeft: "10px" }}>
                {userInfo.street}, {userInfo.city},<br />
                {userInfo.state} - {userInfo.zip}
                <br />
                📞 {userInfo.phone}
              </p>
            </div>
          )}

          <button
            className="icon-button"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            🔍
          </button>

          <Link
            to={`/cart/${userID}`}
            className="icon-button"
            style={{ position: "relative" }}
          >
            🛒
            {cartItems.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {cartItems.length}
              </span>
            )}
          </Link>

          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {showSearch && (
        <div className="dashboard-search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => {
              const keyword = searchQuery.trim().toLowerCase();

              if (
                [
                  "shoe",
                  "shoes",
                  "Adidas",
                  "adidas",
                  "NIKE",
                  "nike",
                  "PUMA",
                  "puma",
                  "nb",
                  "NB",
                  "Skechers",
                ].includes(keyword)
              ) {
                navigate(`/brand/${userID}`);
              } else if (
                ["tshirt", "t shirt", "t-shirts", "tshirts"].includes(keyword)
              ) {
                navigate(`/shop/${userID}`);
              } else if (["jeans"].includes(keyword)) {
                navigate(`/offer/${userID}`);
              } else if (
                [
                  "girls top",
                  "ladies dress",
                  "ledies dress",
                  "ladies",
                  "Shirt",
                  "shirt",
                  "ledies",
                ].includes(keyword)
              ) {
                navigate(`/explore/${userID}`);
              } else {
                alert(`No match found for: ${searchQuery}`);
              }
            }}
          >
            Go
          </button>
        </div>
      )}

      <main className="dashboard-main-content">
        <div className="dashboard-left-column">
          <section className="dashboard-hero-section">
            <div className="dashboard-hero-content">
              <h1>LET'S EXPLORE UNIQUE CLOTHES.</h1>
              <p>A collection for everyone, not just for fashionistas.</p>
              <Link
                to={`/explore/${userID}`}
                className="dashboard-explore-button"
              >
                Explore Now
              </Link>
            </div>
            <div className="dashboard-hero-image">
              <img
                src={heroImages[currentHeroIndex]}
                alt="Hero"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                  transition: "opacity 0.5s ease-in-out",
                }}
              />
            </div>
          </section>

          <section className="dashboard-brand-logos">
            {brands.map((brand, index) => (
              <img key={index} src={brand.logo} alt={`${brand.name} logo`} />
            ))}
          </section>

          <section className="dashboard-product-grid-section">
            <h2>NEW ARRIVALS</h2>
            <div className="dashboard-product-grid">
              {newArrivals.map((product) => (
                <div key={product.id} className="dashboard-product-card">
                  {/* ✅ Trending badge */}
                  <span className="product-trending-badge">Trending</span>

                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                  <button
                    className="dashboard-add-to-cart-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-right-column">
          <aside className="dashboard-sidebar-ad">
            <img
              src={adImages[currentAdIndex].url}
              alt="Ad"
              className="dashboard-ad-image"
            />
            <div className="dashboard-ad-content">
              <h3>{adImages[currentAdIndex].heading}</h3>
              <p>{adImages[currentAdIndex].text}</p>
              <button
                className="dashboard-shop-now-button"
                onClick={() => navigate(`/offer/${userID}`)}
              >
                Shop Now
              </button>
            </div>
          </aside>

          <div className="dashboard-small-product-display">
            <img
              src="https://img.freepik.com/free-photo/happy-smiling-couple-isolated-white-studio-background-stylish-man-woman_285396-4827.jpg"
              alt="Category 1"
            />
            <img
              src="https://img.freepik.com/premium-photo/always-together-beautiful-young-couple-looking-camera_425904-7446.jpg"
              alt="Category 2"
            />
            <img
              src="https://img.freepik.com/premium-photo/png-portrait-fashion-glasses-adult_53876-716367.jpg"
              alt="Category 3"
            />
          </div>

          <section className="dashboard-mobile-app-promo">
            <div className="dashboard-app-content">
              <h3>Download Our App</h3>
              <p>Get exclusive deals and a seamless shopping experience.</p>
              <div className="dashboard-app-download-buttons">
                <div
                  style={{ display: "flex", gap: "16px", marginTop: "20px" }}
                >
                  <a
                    href="https://play.google.com/store/apps/details?id=com.example.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      style={{ height: "50px" }}
                    />
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/example-app/id1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="Download on the App Store"
                      style={{ height: "50px" }}
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="dashboard-app-screenshots">
              <img
                src="https://img.freepik.com/premium-photo/young-beautiful-couple-fashionable-clothes-standing-near-white-wooden-wall_338491-3626.jpg"
                alt="Screenshot 1"
              />
              <img
                src="https://img.freepik.com/free-photo/happy-young-loving-couple-standing-isolated_171337-19513.jpg"
                alt="Screenshot 2"
              />
              <img
                src="https://img.freepik.com/free-photo/portrait-smiling-beautiful-girl-her-handsome-boyfriend-laughing-happy-cheerful-couple-sunglasses-showing-peace-sign_158538-5001.jpg"
                alt="Screenshot 3"
              />
              <img
                src="https://img.freepik.com/free-photo/young-friends-wearing-sunglasses_23-2148478747.jpg?ga=GA1.1.1660874654.1735040715&semt=ais_hybrid&w=740"
                alt="Screenshot 4"
              />
              <img
                src="https://img.freepik.com/premium-photo/always-style-beautiful-young-couple-bonding_425904-7407.jpg?ga=GA1.1.1660874654.1735040715&semt=ais_hybrid&w=740"
                alt="Screenshot 5"
              />
              <img
                src="https://img.freepik.com/premium-photo/photo-portrait-smiling-beautiful-young-happy-couple-wearing-fashionable-clothes-dresses_763111-98982.jpg?ga=GA1.1.1660874654.1735040715&semt=ais_hybrid&w=740"
                alt="Screenshot 6"
              />
            </div>
          </section>

          <section className="dashboard-newsletter-signup">
            <h3>Stay Updated!</h3>
            <p>Subscribe to our newsletter for the latest news and offers.</p>
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
            {newsletterMsg && (
              <p style={{ marginTop: "8px" }}>{newsletterMsg}</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
