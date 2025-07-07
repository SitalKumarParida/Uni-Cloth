const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createAdmin() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userAuth");

  const userID = "admin1";          // admin username
  const email = "admin@example.com";
  const password = "admin123";      // admin password (plaintext)
  const isAdmin = true;

  // Check if admin already exists
  const existing = await User.findOne({ userID });
  if (existing) {
    console.log("Admin already exists");
    return mongoose.disconnect();
  }

  // Hash password and save new admin user
  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({ userID, email, password: hashedPassword, isAdmin }).save();

  console.log("✅ Admin created");
  mongoose.disconnect();
}

createAdmin();
