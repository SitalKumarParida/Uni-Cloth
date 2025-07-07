import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Explore.css";

const ExploreItem = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const cartKey = `cart_${userID}`;
  const [selectedSizes, setSelectedSizes] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5009/api/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) =>
          ["men", "women"].includes(item.category?.toLowerCase())
        );
        setProducts(filtered);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
      });
  }, []);

  const addToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    cartItems.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    alert(`🛒 Added ${product.name} (Size: ${selectedSize}) to cart!`);

    setSelectedSizes((prev) => ({ ...prev, [product._id]: null }));
  };

  const renderProductCard = (product) => (
    <div className="product-card" key={product._id}>
      <span className="product-discount">New</span>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/150?text=No+Image")
        }
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">₹{product.price}</p>
        <div
          className="size-options"
          style={{
            margin: "10px 0",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {["S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              style={{
                padding: "6px 12px",
                border: "1px solid #333",
                borderRadius: "5px",
                backgroundColor:
                  selectedSizes[product._id] === size ? "#4CAF50" : "#f1f1f1",
                color: selectedSizes[product._id] === size ? "#fff" : "#000",
                cursor: "pointer",
              }}
              onClick={() =>
                setSelectedSizes((prev) => ({ ...prev, [product._id]: size }))
              }
            >
              {size}
            </button>
          ))}
        </div>
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );

  const mensProducts = products.filter(
    (item) => item.category.toLowerCase() === "men"
  );
  const womensProducts = products.filter(
    (item) => item.category.toLowerCase() === "women"
  );

  return (
    <div className="shop-container">
      <div className="hero-section">
        <div className="hero-content">
          <p className="hero-tagline">FRESH STYLE FOR EVERYONE</p>
          <h1 className="hero-title">Explore Men’s & Women’s Collection</h1>
          <p className="hero-subtitle">
            Welcome, {userID}! Discover your perfect outfit today.
          </p>
        </div>
        <div className="hero-image-container">
          <img
            src="https://img.freepik.com/free-photo/sexy-smiling-beautiful-woman-her-handsome-boyfriend-happy-cheerful-family-having-tender-momentsyoung-passionate-couple-hugging-sensual-pair-isolated-white-cheerful-happy_158538-22601.jpg"
            alt="Explore Fashion"
            className="hero-image"
          />
        </div>
        <div className="discount-badge">
          <span className="discount-percent">New</span>
          <span className="discount-off">Arrivals</span>
        </div>
      </div>

      {/* 🏠 Go to Home (Dashboard) Button */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={() => navigate(`/dashboard/${userID}`)}
          style={{
            padding: "10px 25px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Go to Home
        </button>
      </div>

      {mensProducts.length > 0 && (
        <div className="deals-section">
          <div className="deals-header">
            <h2 className="deals-title">👔 Men's Collection</h2>
          </div>
          <div className="products-grid">
            {mensProducts.map(renderProductCard)}
          </div>
        </div>
      )}

      {womensProducts.length > 0 && (
        <div className="deals-section">
          <div className="deals-header">
            <h2 className="deals-title">👗 Women's Collection</h2>
          </div>
          <div className="products-grid">
            {womensProducts.map(renderProductCard)}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          className="go-to-cart-btn"
          onClick={() => navigate(`/cart/${userID}`)}
        >
          🛒 Go to Cart
        </button>
      </div>
    </div>
  );
};

export default ExploreItem;
