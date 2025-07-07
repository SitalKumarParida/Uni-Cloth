import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const [day, setDay] = useState("");

  useEffect(() => {
    const today = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    setDay(days[today.getDay()]);
  }, []);

  const handleBuy = () => {
    navigate("/login");
  };

  const handleAdmin = () => {
    navigate("/admin");
  };

  const handleAbout = () => {
    navigate("/about");
  };

  const renderCard = (img, price, discountText = "") => (
    <div className="landing-card">
      {discountText && <div className="discount-badge">{discountText}</div>}
      <img src={img} alt="product" className="landing-card-image" />
      <div className="landing-card-content">
        <h3 className="landing-card-title">New Arrival</h3>
        <p className="landing-card-price">₹{price}</p>
        <button className="landing-buy-button" onClick={handleBuy}>
          Buy Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="landing-container">
      <header
        className="landing-header"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fh260/background/20240721/pngtree-clothes-hang-on-hangers-photo-image_16077106.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="landing-overlay">
          <h1 className="landing-title">
            <span className="landing-brand">Welcome to Uni Cloth</span>
          </h1>
          <span className="landing-brand">
            Discover trendy fashion before logging in!
          </span>
          <div className="landing-button-group">
            <button className="landing-login-button" onClick={handleBuy}>
              Login to Continue Shopping
            </button>
            <button className="landing-admin-button" onClick={handleAdmin}>
              Admin
            </button>
            <button className="landing-about-button" onClick={handleAbout}>
              About Us
            </button>
          </div>
        </div>
      </header>

      {/* 🌟 Today Special Section */}
      <div className="special-day-banner">
        <h2>🌟 {day}’s Special</h2>
      </div>

      {/* Men's Clothing */}
      <section className="landing-product-grid">
        <h2 className="landing-section-title">👕 Men's Clothing</h2>
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/q/1/q/xxl-bblrnful-plainz133-blive-original-imaha9q682vhzcp9.jpeg?q=70",
          999,
          "40% OFF"
        )}
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/a/3/r/xl-r-hf-458-white-london-hills-original-imahybz6pmyejfgj.jpeg?q=70",
          1299,
          "40% OFF"
        )}
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/p/o/h/xs-db1024-3bros-original-imah2gbagpw87ycp.jpeg?q=70",
          1299,
          "40% OFF"
        )}
      </section>

      {/* Shoes */}
      <section className="landing-product-grid">
        <h2 className="landing-section-title">👟 Trending Shoes</h2>
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/j/i/k/-original-imahd2zmkvbhds4a.jpeg?q=70",
          1499,
          "25% OFF"
        )}
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shopsy-shoe/5/y/m/10-615-navy-boldness-navy-original-imaghntphnvfgutq.jpeg?q=70",
          1199,
          "25% OFF"
        )}
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/e/g/b/9-white-top-sportcasual-shoe-9-laxyash-white-original-imahcfadngbb8syb.jpeg?q=70",
          1199,
          "25% OFF"
        )}
      </section>

      {/* Women's Clothing */}
      <section className="landing-product-grid">
        <h2 className="landing-section-title"> Trending Jeans</h2>
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/jean/u/o/a/28-003-baggy-jean-jaar-fashion-original-imah3uaceg4x68vz.jpeg?q=70",
          799
        )}
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/jean/f/z/y/32-hljn000889-highlander-original-imafw2gfy2gggcs6-bb.jpeg?q=70",
          1299
        )}
        {renderCard(
          "https://rukminim2.flixcart.com/image/612/612/xif0q/jean/u/e/t/30-000894-highlander-original-imafpchpgkqbzmr5-bb.jpeg?q=70",
          1299
        )}
      </section>
    </div>
  );
}

export default Landing;
