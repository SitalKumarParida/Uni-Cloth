import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const [payments, setPayments] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
    category: "shop",
  });
  const [allProducts, setAllProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedView, setSelectedView] = useState("shop");
  const [cancellations, setCancellations] = useState([]); // ✅ NEW

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const adminID = localStorage.getItem("adminID");

    if (isAdmin !== "true" || !adminID) {
      alert("❌ Unauthorized. Please login as admin.");
      navigate("/admin-login");
      return;
    }

    axios
      .get("http://localhost:5009/api/payment")
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("❌ Failed to fetch payments:", err));

    fetchAllProducts();

    axios
      .get("http://localhost:5009/api/message")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("❌ Failed to fetch messages:", err));

    axios
      .get("http://localhost:5009/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("❌ Failed to fetch users:", err));

    // ✅ Fetch cancellation requests
    axios
      .get("http://localhost:5009/api/cancelRequest")
      .then((res) => setCancellations(res.data))
      .catch((err) => console.error("❌ Failed to fetch cancellations:", err));
  }, [navigate]);

  const fetchAllProducts = () => {
    axios
      .get("http://localhost:5009/api/products")
      .then((res) => setAllProducts(res.data))
      .catch((err) => console.error("❌ Failed to fetch products:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminID");
    navigate("/admin-login");
  };

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5009/api/products", product);
      alert("✅ Product added successfully");
      setProduct({ name: "", price: "", imageUrl: "", category: "shop" });
      fetchAllProducts();
    } catch (err) {
      console.error("❌ Error adding product:", err);
      alert("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`http://localhost:5009/api/products/${id}`);
      fetchAllProducts();
      alert("🗑️ Product deleted successfully");
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      await axios.delete(`http://localhost:5009/api/message/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
      alert("🗑️ Message deleted");
    } catch (err) {
      console.error("❌ Failed to delete message:", err);
      alert("Failed to delete message");
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user account permanently?"
      )
    )
      return;
    try {
      await axios.delete(`http://localhost:5009/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      alert("🗑️ User account deleted permanently");
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
      alert("Failed to delete user account");
    }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment entry?"))
      return;
    try {
      await axios.delete(`http://localhost:5009/api/payment/${id}`);
      setPayments(payments.filter((payment) => payment._id !== id));
      alert("🗑️ Payment deleted");
    } catch (err) {
      console.error("❌ Failed to delete payment:", err);
      alert("Failed to delete payment");
    }
  };

  const groupedPayments = payments.reduce((acc, payment) => {
    if (!acc[payment.userID]) acc[payment.userID] = [];
    acc[payment.userID].push(payment);
    return acc;
  }, {});

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="view-selector">
          <label>Select View:</label>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="shop">Shop</option>
            <option value="offer">Offer</option>
            <option value="brand">Brand</option>
            <option value="cart">Cart</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="message">Message</option>
            <option value="users">Users</option>
            <option value="paymentHistory">Payment History</option>
            <option value="cancelRequest">Cancelled Orders</option>{" "}
            {/* ✅ New */}
          </select>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Add Product */}
      {[
        "shop",
        "offer",
        "explore",
        "dashboard",
        "brand",
        "cart",
        "men",
        "women",
      ].includes(selectedView) && (
        <div className="add-product-form">
          <h3>➕ Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={product.imageUrl}
              onChange={handleInputChange}
              required
            />
            <select
              name="category"
              value={product.category}
              onChange={handleInputChange}
            >
              <option value="shop">Shop</option>
              <option value="offer">Offer</option>
              <option value="brand">Brand</option>
              <option value="cart">Cart</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      {/* Products */}
      {[
        "shop",
        "offer",
        "explore",
        "dashboard",
        "brand",
        "cart",
        "men",
        "women",
      ].includes(selectedView) && (
        <div className="products-container">
          <h3>🛍️ {selectedView.toUpperCase()} Products</h3>
          <div className="products-grid">
            {allProducts
              .filter((item) => item.category === selectedView)
              .map((item) => (
                <div key={item._id} className="product-card">
                  <img src={item.imageUrl} alt={item.name} />
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <button
                    onClick={() => handleDeleteProduct(item._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {selectedView === "message" && (
        <>
          <h3 className="section-title">📨 User Messages</h3>
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="message-card">
                <p>
                  <strong>UserID:</strong> {msg.userID}
                </p>
                <p>
                  <strong>Message:</strong> {msg.message}
                </p>
                <p className="timestamp">
                  <strong>Submitted At:</strong>{" "}
                  {new Date(msg.submittedAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDeleteMessage(msg._id)}
                  className="delete-message-button"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </>
      )}

      {/* Users */}
      {selectedView === "users" && (
        <>
          <h3 className="section-title">👥 Registered Users</h3>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => {
              const latestAddress =
                user.addresses && user.addresses.length > 0
                  ? user.addresses[user.addresses.length - 1]
                  : null;
              return (
                <div key={user._id} className="user-card">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {user.mobile}
                  </p>

                  {latestAddress ? (
                    <div className="current-address">
                      <strong>Current Address:</strong>
                      <p>{latestAddress.fullName}</p>
                      <p>
                        {latestAddress.street}, {latestAddress.city},{" "}
                        {latestAddress.state} - {latestAddress.zip}
                      </p>
                      <p>{latestAddress.phone}</p>
                    </div>
                  ) : (
                    <p>
                      <em>No current address saved.</em>
                    </p>
                  )}

                  {user.addresses && user.addresses.length > 0 && (
                    <div className="address-history">
                      <strong>Saved Addresses:</strong>
                      {user.addresses.map((addr, i) => (
                        <div key={i} className="address-block">
                          <p>{addr.fullName}</p>
                          <p>
                            {addr.street}, {addr.city}, {addr.state} -{" "}
                            {addr.zip}
                          </p>
                          <p>{addr.phone}</p>
                          <hr />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="delete-user-button"
                  >
                    🗑️ Delete Account
                  </button>
                </div>
              );
            })
          )}
        </>
      )}

      {/* Payment History */}
      {selectedView === "paymentHistory" && (
        <>
          <h3 className="section-title">📜 Payment History</h3>
          {Object.keys(groupedPayments).length === 0 ? (
            <p>No payments found.</p>
          ) : (
            Object.entries(groupedPayments).map(([user, history], index) => (
              <div key={index}>
                <h4 className="user-payment-header">👤 User: {user}</h4>
                {history.map((entry, idx) => (
                  <div key={idx} className="payment-card">
                    <p className="payment-timestamp">
                      <strong>Paid At:</strong>{" "}
                      {new Date(entry.paidAt).toLocaleString()}
                    </p>
                    <ul className="payment-items">
                      {entry.items.map((item, i) => (
                        <li key={i}>
                          {item.name} - ₹{item.price} × {item.quantity || 1}{" "}
                          {item.size ? `(${item.size})` : ""}
                        </li>
                      ))}
                    </ul>
                    {entry.address && (
                      <div className="shipping-address">
                        <strong>Shipping Address:</strong>
                        <p>{entry.address.fullName}</p>
                        <p>
                          {entry.address.street}, {entry.address.city},{" "}
                          {entry.address.state} - {entry.address.zip}
                        </p>
                        <p>{entry.address.country}</p>
                        <p>Phone: {entry.address.phone}</p>
                      </div>
                    )}
                    <button
                      onClick={() => handleDeletePayment(entry._id)}
                      className="delete-payment-button"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </>
      )}

      {/* ✅ Cancelled Orders View */}
      {selectedView === "cancelRequest" && (
        <>
          <h3 className="section-title">🛑 Cancelled Orders with UPI</h3>
          {cancellations.length === 0 ? (
            <p>No cancellation requests found.</p>
          ) : (
            cancellations.map((entry, i) => (
              <div key={i} className="cancel-card">
                <p>
                  <strong>User ID:</strong> {entry.userID}
                </p>
                <p>
                  <strong>UPI ID:</strong> {entry.upiId}
                </p>
                <p>
                  <strong>Total:</strong> ₹{entry.total}
                </p>
                <p>
                  <strong>Cancelled At:</strong>{" "}
                  {new Date(entry.date).toLocaleString()}
                </p>
                <ul>
                  {entry.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} — ₹{item.price}
                    </li>
                  ))}
                </ul>
                <hr />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
