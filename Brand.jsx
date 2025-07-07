// Brand.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Brand.css";
import axios from "axios";

const Brand = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const cartKey = `cart_${userID}`;

  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5009/api/products/brand")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("❌ Failed to load products:", err));
  }, []);

  const styles = {
    sizeOptions: {
      display: "flex",
      gap: "8px",
      marginTop: "8px",
      flexWrap: "wrap",
    },
    sizeBtn: (isSelected) => ({
      padding: "6px 12px",
      border: "1px solid #333",
      borderRadius: "5px",
      backgroundColor: isSelected ? "#4CAF50" : "#f9f9f9",
      color: isSelected ? "#fff" : "#000",
      cursor: "pointer",
    }),
  };

  const addToCart = (product) => {
    const size = selectedSizes[product._id];
    if (!size) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    existingCart.push({
      name: product.name,
      price: product.price,
      size: size,
    });

    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    alert(`${product.name} (Size: ${size}) added to cart!`);

    setSelectedSizes((prev) => ({ ...prev, [product._id]: null }));
  };

  return (
    <div className="brand-container">
      {/* 🏠 Go to Home Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate(`/dashboard/${userID}`)}
          style={{
            padding: "10px 20px",
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

      <h2>Brand Products</h2>
      <div className="brand-product-list">
        {products.map((product) => (
          <div
            className="brand-card"
            key={product._id}
            style={{ position: "relative" }}
          >
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>

            <div style={styles.sizeOptions}>
              {[6, 7, 8, 9, 10].map((size) => (
                <button
                  key={size}
                  style={styles.sizeBtn(selectedSizes[product._id] === size)}
                  onClick={() =>
                    setSelectedSizes((prev) => ({
                      ...prev,
                      [product._id]: size,
                    }))
                  }
                >
                  {size}
                </button>
              ))}
            </div>

            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <br />
      <button onClick={() => navigate(`/cart/${userID}`)}>Go to Cart</button>
    </div>
  );
};

export default Brand;
