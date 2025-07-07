import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

function Cart() {
  const { userID } = useParams();
  const cartKey = `cart_${userID}`;
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [refundMessage, setRefundMessage] = useState("");
  const [cancelledOrders, setCancelledOrders] = useState(() => {
    const stored = localStorage.getItem(`cancelled_${userID}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [orderHistory, setOrderHistory] = useState(() => {
    const stored = localStorage.getItem(`history_${userID}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const stored = localStorage.getItem(cartKey);
    const parsed = stored ? JSON.parse(stored) : [];
    setCartItems(parsed);

    if (parsed.length > 0) {
      axios
        .post("http://localhost:5009/api/cart/save", {
          userID,
          items: parsed.map((item) => ({
            ...item,
            price: Number(item.price),
          })),
        })
        .then((res) => {
          console.log("🛒 Cart saved to DB:", res.data);
          setSaveMessage("✅ Cart successfully saved to database.");
          setTimeout(() => setSaveMessage(""), 3000);
        })
        .catch((err) => {
          console.error("❌ Failed to save cart:", err);
          setSaveMessage("❌ Failed to save cart to database.");
        });
    }

    axios
      .get(`http://localhost:5009/api/address/all/${userID}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAddresses(res.data);
          setSelectedAddress(res.data[0]);
          setShowAddressForm(false);
        } else {
          setShowAddressForm(true);
        }
      })
      .catch(() => {
        setShowAddressForm(true);
      });
  }, [cartKey, userID]);

  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem(cartKey, JSON.stringify(updated));
  };

  const clearCart = () => {
    localStorage.removeItem(cartKey);
    setCartItems([]);
    setShowCheckout(false);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const handlePayment = () => {
    if (!selectedAddress) {
      alert("⚠️ Please select or save a shipping address before payment.");
      return;
    }

    alert("✅ Payment Successful!");

    const paymentData = {
      userID,
      items: cartItems.map((item) => ({ ...item, price: Number(item.price) })),
      total: totalAmount,
      date: new Date().toISOString(),
      address: selectedAddress,
    };

    axios
      .post("http://localhost:5009/api/payment", paymentData)
      .then(() => {
        setSaveMessage("✅ Payment saved successfully.");
      })
      .catch(() => {
        setSaveMessage("❌ Failed to save payment.");
      });

    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total: totalAmount,
      date: new Date().toLocaleString(),
      address: selectedAddress,
    };
    const updatedHistory = [...orderHistory, newOrder];
    localStorage.setItem(`history_${userID}`, JSON.stringify(updatedHistory));
    setOrderHistory(updatedHistory);
    clearCart();
  };

  const removeHistoryItem = (id) => {
    const updated = orderHistory.filter((entry) => entry.id !== id);
    setOrderHistory(updated);
    localStorage.setItem(`history_${userID}`, JSON.stringify(updated));
  };

  const handleStartCancel = (orderId) => {
    setCancellingOrderId(orderId);
    setUpiId("");
    setRefundMessage("");
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
  };

  const handleSubmitRefund = () => {
    if (!upiId.trim()) {
      alert("Please enter your UPI ID for refund.");
      return;
    }

    setRefundMessage(
      "Your amount will be refunded shortly to UPI: " + upiId.trim()
    );

    const newCancelled = [...cancelledOrders, cancellingOrderId];
    setCancelledOrders(newCancelled);
    localStorage.setItem(`cancelled_${userID}`, JSON.stringify(newCancelled));

    const entryToCancel = orderHistory.find(
      (entry) => entry.id === cancellingOrderId
    );

    if (entryToCancel) {
      axios
        .post("http://localhost:5009/api/cancelRequest", {
          userID,
          upiId: upiId.trim(),
          total: entryToCancel.total,
          items: entryToCancel.items,
        })
        .then(() => {
          console.log("✅ Cancel request sent to backend.");
        })
        .catch((err) => {
          console.error("❌ Error sending cancel request:", err);
        });
    }

    setCancellingOrderId(null);
    setUpiId("");
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const submitAddress = () => {
    axios
      .post("http://localhost:5009/api/address", {
        userID,
        address: addressForm,
      })
      .then((res) => {
        alert(res.data.message || "Address saved successfully.");

        const newAddressWithId = {
          ...addressForm,
          _id: res.data.addressId || Date.now().toString(),
        };
        const updatedAddresses = [...addresses, newAddressWithId];
        setAddresses(updatedAddresses);
        setSelectedAddress(newAddressWithId);
        setAddressForm({
          fullName: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
        });
        setShowAddressForm(false);
      })
      .catch(() => {
        alert("❌ Failed to save address.");
      });
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setShowAddressForm(false);
  };

  return (
    <div className="cart-page">
      <div className="home-button-container">
        <button
          onClick={() => navigate(`/dashboard/${userID}`)}
          className="home-button"
        >
          Go to Home
        </button>
      </div>

      <h2 className="cart-title">🛒 Your Cart</h2>

      {saveMessage && (
        <p
          className={`save-message ${
            saveMessage.includes("❌") ? "error" : "success"
          }`}
        >
          {saveMessage}
        </p>
      )}

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div>
                  <strong>{item.name}</strong> — ₹{item.price}{" "}
                  {item.size && `(Size: ${item.size})`}
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="remove-item-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p>
              <strong>Total:</strong> ₹{totalAmount}
            </p>
            <button onClick={clearCart} className="clear-cart-button">
              Clear Cart
            </button>
            <button
              onClick={() => setShowCheckout(true)}
              className="checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {showCheckout && (
        <div className="checkout-container">
          <h3>💳 Enter Card Details</h3>

          {/* Cardholder Name - letters and space only */}
          <input
            type="text"
            placeholder="Cardholder Name"
            className="checkout-input"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
            }
          />

          {/* Card Number - 16 digits only */}
          <input
            type="text"
            placeholder="Card Number"
            maxLength={16}
            className="checkout-input"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
          />

          <div className="checkout-input-group">
            {/* Expiry Date - MM/YY format only */}
            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              className="checkout-input"
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^0-9/]/g, ""))
              }
            />

            {/* CVV - 3 digits only */}
            <input
              type="password"
              placeholder="CVV"
              maxLength={3}
              className="checkout-input"
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <button
            onClick={handlePayment}
            className="pay-now-button"
            disabled={cartItems.length === 0}
          >
            Pay Now
          </button>
        </div>
      )}

      {orderHistory.length > 0 && (
        <div className="order-history">
          <h3>🧾 Order History</h3>
          <ul>
            {orderHistory.map((entry) => (
              <li key={entry.id} className="order-item">
                <p>
                  <strong>🕒 {entry.date}</strong>
                </p>
                <ul className="order-items-list">
                  {entry.items.map((item, index) => (
                    <li key={index}>
                      {item.name} — ₹{item.price}{" "}
                      {item.size && `(Size: ${item.size})`}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong> ₹{entry.total}
                </p>

                <div className="shipping-address">
                  <strong>Shipping Address:</strong>
                  <br />
                  {entry.address ? (
                    <>
                      {entry.address.fullName}
                      <br />
                      {entry.address.street}, {entry.address.city},{" "}
                      {entry.address.state} {entry.address.zip}
                      <br />
                      📞 {entry.address.phone}
                    </>
                  ) : (
                    "No address provided."
                  )}
                </div>

                {!cancelledOrders.includes(entry.id) && (
                  <>
                    {cancellingOrderId === entry.id ? (
                      <div className="upi-form">
                        <label htmlFor={`upi-${entry.id}`}>
                          Enter your UPI ID for refund:
                        </label>
                        <input
                          id={`upi-${entry.id}`}
                          type="text"
                          value={upiId}
                          onChange={handleUpiChange}
                          placeholder="example@upi"
                          className="upi-input"
                        />
                        <button
                          onClick={handleSubmitRefund}
                          className="submit-upi-button"
                        >
                          Submit UPI
                        </button>
                        <button
                          onClick={() => setCancellingOrderId(null)}
                          className="cancel-upi-button"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartCancel(entry.id)}
                        className="cancel-order-button"
                      >
                        Cancel Order
                      </button>
                    )}
                  </>
                )}

                {cancelledOrders.includes(entry.id) && (
                  <p className="refund-message">
                    Your amount will be refunded shortly.
                  </p>
                )}

                <button
                  onClick={() => removeHistoryItem(entry.id)}
                  className="remove-history-button"
                >
                  Remove from History
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="address-container">
        <h3>📍 Shipping Address</h3>

        {!showAddressForm ? (
          <>
            {addresses.length === 0 ? (
              <p>No saved addresses found.</p>
            ) : (
              <ul className="address-list">
                {addresses.map((addr, i) => (
                  <li
                    key={addr._id || i}
                    onClick={() => handleSelectAddress(addr)}
                    className={`address-item ${
                      selectedAddress &&
                      (selectedAddress._id || selectedAddress.fullName) ===
                        (addr._id || addr.fullName)
                        ? "selected"
                        : ""
                    }`}
                  >
                    <p>
                      <strong>{addr.fullName}</strong>
                    </p>
                    <p>
                      {addr.street}, {addr.city}, {addr.state} {addr.zip}
                    </p>
                    <p>📞 {addr.phone}</p>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowAddressForm(true)}
              className="add-address-button"
            >
              + Add New Address
            </button>
          </>
        ) : (
          <>
            <input
              name="fullName"
              placeholder="Full Name"
              value={addressForm.fullName}
              onChange={handleAddressChange}
              className="address-input"
            />
            <input
              name="street"
              placeholder="Street Address"
              value={addressForm.street}
              onChange={handleAddressChange}
              className="address-input"
            />
            <input
              name="city"
              placeholder="City"
              value={addressForm.city}
              onChange={handleAddressChange}
              className="address-input"
            />
            <input
              name="state"
              placeholder="State"
              value={addressForm.state}
              onChange={handleAddressChange}
              className="address-input"
            />
            <input
              name="zip"
              placeholder="Zip Code"
              value={addressForm.zip}
              onChange={handleAddressChange}
              className="address-input"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={addressForm.phone}
              onChange={handleAddressChange}
              className="address-input"
            />

            <div className="address-form-buttons">
              <button onClick={submitAddress} className="save-address-button">
                Save Address
              </button>
              <button
                onClick={() => setShowAddressForm(false)}
                className="cancel-address-button"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
