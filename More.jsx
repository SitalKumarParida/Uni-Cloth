import React from "react";
import { useNavigate } from "react-router-dom";
import "./Shop.css"; // Reuse the same CSS for consistency

const moreProducts = [
  {
    id: 1,
    name: "Trendy Sunglasses",
    originalPrice: 1200,
    discountedPrice: 699,
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/7/a/z/xl-ts36-vebnor-original-imahbyggbtzhfehy.jpeg?q=70",
  },
];

const More = () => {
  const navigate = useNavigate();

  return (
    <div className="shop-container">
      {/* Header */}
      <div className="hero-section">
        <div className="hero-content">
          <p className="hero-tagline">FRESH COLLECTION</p>
          <h1 className="hero-title">More Trending Styles</h1>
          <p className="hero-subtitle">
            Discover top-rated essentials just for you!
          </p>
        </div>
        <div className="hero-image-container">
          <img
            src="https://rukminim2.flixcart.com/image/300/300/xif0q/t-shirt/k/o/x/l-452-453-461-combo-london-hills-original-imahagmqkugzfcze.jpeg?q=90"
            alt="New Collection"
            className="hero-image"
          />
        </div>
        <div className="discount-badge">
          <span className="discount-percent">New</span>
          <span className="discount-off">Arrivals</span>
        </div>
      </div>

      {/* More Products Grid */}
      <div className="deals-section">
        <div className="deals-header">
          <div>
            <h2 className="deals-title">Recommended for You</h2>
            <p className="deals-subtitle">Handpicked premium products</p>
          </div>
        </div>

        <div className="products-grid">
          {moreProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <span className="product-discount">
                -
                {Math.round(
                  ((product.originalPrice - product.discountedPrice) /
                    product.originalPrice) *
                    100
                )}
                %
              </span>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="price-section">
                  <span className="original-price">
                    ₹{product.originalPrice}
                  </span>
                  <span className="discounted-price">
                    ₹{product.discountedPrice}
                  </span>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => alert(`Added ${product.name} to cart!`)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default More;
