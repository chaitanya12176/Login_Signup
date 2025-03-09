const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  signupOTP: String, // Store OTP for signup verification
  otpExpires: Date,  // OTP expiration time
});

module.exports = mongoose.model("users", UserSchema);
