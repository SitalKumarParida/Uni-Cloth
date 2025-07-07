import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Offer = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const cartKey = `cart_${userID}`;

  const [offerProducts, setOfferProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5009/api/products");
        const data = await res.json();
        const filtered = data.filter(
          (product) => product.category.toLowerCase() === "offer"
        );
        setOfferProducts(filtered);
        console.log("✅ Offer products fetched:", filtered);
      } catch (err) {
        console.error("❌ Failed to load offer products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const alreadyExists = storedCart.some(
      (item) => item.name === product.name && item.size === selectedSize
    );
    if (alreadyExists) {
      alert(
        `⚠️ ${product.name} (Size: ${selectedSize}) is already in your cart.`
      );
      return;
    }

    const cartItem = {
      name: product.name,
      price: product.price,
      size: selectedSize,
    };

    storedCart.push(cartItem);
    localStorage.setItem(cartKey, JSON.stringify(storedCart));
    alert(`🛒 ${product.name} (Size: ${selectedSize}) added to cart!`);
    console.log("✅ Cart updated:", storedCart);

    setSelectedSizes((prev) => ({ ...prev, [product._id]: null }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.promoHeader}>Jeans for Men</h2>

      <div style={styles.banner}>
        <img
          src="https://rukminim2.flixcart.com/image/612/612/xif0q/jean/v/r/r/32-32202195-glitchez-original-imahbs4uqzaenzaz.jpeg?q=70"
          alt="35% Off"
          style={styles.bannerImage}
        />
        <div style={styles.discountText}>🔥 35% OFF</div>
      </div>

      {/* 🏠 Go to Home Button */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
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

      <h1 style={styles.heading}>🔥 Exclusive Offers For You</h1>
      <p style={styles.subheading}>
        Grab the hottest deals before they’re gone!
      </p>

      <div style={styles.grid}>
        {offerProducts.map((product) => (
          <div key={product._id} style={styles.card}>
            <div style={styles.productDiscount}>35% OFF</div>

            <img
              src={product.imageUrl}
              alt={product.name || "Offer product"}
              style={styles.image}
            />
            <h3 style={styles.name}>{product.name}</h3>
            <p style={styles.price}>₹{product.price}</p>

            <div style={styles.sizeOptions}>
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setSelectedSizes((prev) => ({
                      ...prev,
                      [product._id]: size,
                    }))
                  }
                  style={{
                    ...styles.sizeButton,
                    backgroundColor:
                      selectedSizes[product._id] === size
                        ? "#1976d2"
                        : "#f0f0f0",
                    color:
                      selectedSizes[product._id] === size ? "#fff" : "#000",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              style={styles.button}
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <button
        style={styles.goToCartButton}
        onClick={() => navigate(`/cart/${userID}`)}
      >
        🛍️ Go to Cart
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  promoHeader: {
    fontSize: "26px",
    color: "#444",
    textAlign: "center",
    marginBottom: "10px",
    fontWeight: "600",
  },
  banner: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    justifyContent: "center",
  },
  bannerImage: {
    height: "180px",
    width: "auto",
    borderRadius: "12px",
    objectFit: "cover",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  discountText: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#d32f2f",
    background: "#fff",
    padding: "12px 24px",
    borderRadius: "10px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    color: "#333",
    marginBottom: "8px",
  },
  subheading: {
    textAlign: "center",
    color: "#777",
    fontSize: "16px",
    marginBottom: "30px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "24px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "20px",
    width: "260px",
    textAlign: "center",
    position: "relative",
  },
  productDiscount: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#e53935",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: "6px",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "12px",
  },
  name: {
    fontSize: "20px",
    margin: "8px 0",
    color: "#444",
  },
  price: {
    fontSize: "18px",
    color: "#2e7d32",
    marginBottom: "14px",
    fontWeight: "bold",
  },
  sizeOptions: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  sizeButton: {
    padding: "6px 12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.2s",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  goToCartButton: {
    marginTop: "40px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "12px 28px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#43a047",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Offer;
