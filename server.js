const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("./models/User");
const Product = require("./models/Product");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/userAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
const messageSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

app.post("/api/message", async (req, res) => {
  const { userID, message, submittedAt } = req.body;

  if (!userID || !message) {
    return res.status(400).json({ message: "Missing userID or message" });
  }

  try {
    const newMessage = new Message({
      userID,
      message,
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
    });
    await newMessage.save();
    console.log("📨 Message saved from:", userID);
    res.json({ message: "Message saved successfully" });
  } catch (err) {
    console.error("❌ Failed to save message:", err);
    res.status(500).json({ message: "Server error saving message" });
  }
});
// ✅ GET all messages
app.get("/api/message", async (req, res) => {
  try {
    const messages = await Message.find().sort({ submittedAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// ✅ DELETE a message by ID
app.delete("/api/message/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete message:", err);
    res.status(500).json({ message: "Failed to delete message" });
  }
});

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  const { userID, email, password, isAdmin = false, mobile } = req.body;

  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ message: "Mobile number must be 10 digits" });
  }

  try {
    const existingUser = await User.findOne({ userID });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userID,
      email,
      password: hashedPassword,
      isAdmin,
      mobile,
    });
    await newUser.save();

    console.log("✅ New user saved:", newUser.userID);
    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { userID, password } = req.body;
  try {
    console.log("🔐 Login attempt:", userID);
    const user = await User.findOne({ userID });

    if (!user) {
      console.log("❌ No user found with ID:", userID);
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", userID);
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    console.log("✅ Login successful for:", userID);
    res.json({
      message: "Login successful",
      isAdmin: user.isAdmin || false,
      userID: user.userID,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  const { userID, email } = req.body;
  try {
    const user = await User.findOne({ userID, email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password",
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    await transporter.sendMail({
      from: '"Support" <your-email@gmail.com>',
      to: user.email,
      subject: "Password Reset Link",
      html: `<p>Click to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    console.log("📧 Reset link sent to:", user.email);
    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Reset Password Route
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log("✅ Password updated for:", user.userID);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Reset failed" });
  }
});

// ✅ Cancel Request Schema & Routes
const cancelSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  upiId: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      size: String,
    },
  ],
  total: Number,
  date: { type: Date, default: Date.now },
});
const CancelRequest = mongoose.model("CancelRequest", cancelSchema);

app.post("/api/cancelRequest", async (req, res) => {
  const { userID, upiId, items, total } = req.body;
  if (!userID || !upiId || !items || !total) {
    return res.status(400).json({ message: "Invalid cancel request" });
  }

  try {
    const cancelReq = new CancelRequest({ userID, upiId, items, total });
    await cancelReq.save();
    console.log("📦 Cancel request saved:", userID);
    res.json({ message: "Cancel request saved successfully" });
  } catch (err) {
    console.error("❌ Failed to save cancel request:", err);
    res.status(500).json({ message: "Failed to save cancel request" });
  }
});

app.get("/api/cancelRequest", async (req, res) => {
  try {
    const cancels = await CancelRequest.find().sort({ date: -1 });
    res.json(cancels);
  } catch (err) {
    console.error("❌ Failed to fetch cancel requests:", err);
    res.status(500).json({ message: "Failed to fetch cancel requests" });
  }
});
// ✅ Cart Schema & Routes
const cartSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      size: String,
      quantity: { type: Number, default: 1 },
    },
  ],
  savedAt: { type: Date, default: Date.now },
});
const Cart = mongoose.model("Cart", cartSchema);

app.post("/api/cart/save", async (req, res) => {
  const { userID, items } = req.body;

  if (!userID || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid cart data" });
  }

  try {
    await Cart.findOneAndUpdate(
      { userID },
      { items, savedAt: new Date() },
      { upsert: true, new: true }
    );

    console.log("✅ Cart saved for", userID);
    res.json({ message: "Cart saved successfully" });
  } catch (error) {
    console.error("❌ Failed to save cart:", error);
    res.status(500).json({ message: "Failed to save cart" });
  }
});

// ✅ Newsletter Schema & Route
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});
const Newsletter = mongoose.model("Newsletter", newsletterSchema);

app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    console.log("✅ New subscriber:", email);
    res.json({ message: "Subscription successful" });
  } catch (error) {
    console.error("❌ Subscription error:", error);
    res.status(500).json({ message: "Subscription failed" });
  }
});

// ✅ Payment Schema
const paymentSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      size: String,
      quantity: { type: Number, default: 1 },
    },
  ],
  address: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
  },
  paidAt: { type: Date, default: Date.now },
});
const Payment = mongoose.model("Payment", paymentSchema);

app.post("/api/payment", async (req, res) => {
  const { userID, items, address } = req.body;

  if (!userID || !items || !Array.isArray(items) || items.length === 0 || !address) {
    return res.status(400).json({ message: "Invalid payment data" });
  }

  try {
    const newPayment = new Payment({ userID, items, address });
    await newPayment.save();

    console.log("✅ Payment saved for", userID);
    res.json({ message: "Payment saved successfully" });
  } catch (error) {
    console.error("❌ Failed to save payment:", error);
    res.status(500).json({ message: "Failed to save payment" });
  }
});

// ✅ 🆕 GET Payments
app.get("/api/payment", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paidAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Failed to fetch payments:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

// ✅ 🆕 DELETE Payment
app.delete("/api/payment/:id", async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete payment:", err);
    res.status(500).json({ message: "Failed to delete payment" });
  }
});

// ✅ Make user admin
app.get("/make-admin/:userID", async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = true;
    await user.save();
    console.log(`✅ ${userID} promoted to admin`);
    res.json({ message: `${userID} is now an admin` });
  } catch (err) {
    console.error("❌ Failed to make admin:", err);
    res.status(500).json({ message: "Failed to update admin status" });
  }
});

// ✅ Product Routes
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.get("/api/products/brand", async (req, res) => {
  try {
    const brandProducts = await Product.find({ category: "brand" });
    res.json(brandProducts);
  } catch (err) {
    console.error("❌ Failed to fetch brand products:", err);
    res.status(500).json({ message: "Failed to fetch brand products" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, imageUrl, category } = req.body;
    const product = new Product({ name, price, imageUrl, category });
    await product.save();
    res.json({ message: "Product added successfully" });
  } catch (err) {
    console.error("❌ Failed to add product:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("❌ Failed to delete product:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// ✅ Address Routes
const addressSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  fullName: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
});
const Address = mongoose.model("Address", addressSchema);

app.post("/api/address", async (req, res) => {
  const { userID, address } = req.body;

  try {
    const exists = await Address.findOne({
      userID,
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone,
    });

    if (exists) {
      return res.json({ message: "Address already saved", addressId: exists._id });
    }

    const newAddress = new Address({ userID, ...address });
    await newAddress.save();

    const user = await User.findOne({ userID });
    if (user) {
      user.address = address;
      if (!user.addresses) user.addresses = [];
      user.addresses.push(address);
      await user.save();
      console.log(`📦 Address also saved in user.address and user.addresses[] for ${userID}`);
    }

    res.json({ message: "Address saved successfully", addressId: newAddress._id });
  } catch (err) {
    console.error("❌ Failed to save address:", err);
    res.status(500).json({ message: "Failed to save address" });
  }
});

app.get("/api/address/all/:userID", async (req, res) => {
  try {
    const addresses = await Address.find({ userID: req.params.userID });
    res.json(addresses);
  } catch (err) {
    console.error("❌ Failed to fetch addresses:", err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});

app.get("/api/address/:userID", async (req, res) => {
  try {
    const found = await Address.findOne({ userID: req.params.userID });
    res.json(found || {});
  } catch (err) {
    console.error("❌ Failed to fetch address:", err);
    res.status(500).json({ message: "Failed to fetch address" });
  }
});

// ✅ Admin Routes
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password -resetToken -resetTokenExpiry");
    res.json(users);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.delete("/api/users/:userID", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userID);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User ${req.params.userID} deleted successfully` });
  } catch (err) {
    console.error("❌ Failed to delete user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ✅ Start Server
const PORT = 5009;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

