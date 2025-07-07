const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User"); // adjust path if models folder is elsewhere

mongoose.connect("mongodb://127.0.0.1:27017/userAuth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function resetPassword() {
  try {
    const hashed = await bcrypt.hash("123456", 10);
    const updatedUser = await User.findOneAndUpdate(
      { userID: "situ1" },
      { password: hashed },
      { new: true }
    );
    if (!updatedUser) {
      console.log("❌ User not found");
    } else {
      console.log("✅ Password reset to 123456 for situ1");
    }
  } catch (err) {
    console.error("❌ Error resetting password:", err);
  } finally {
    mongoose.disconnect();
  }
}

resetPassword();
