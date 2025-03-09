const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const OTP = require("../models/Otp"); // Import OTP model
require("dotenv").config();

const router = express.Router();

// ✅ Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587, // Use 587 for TLS
  secure: false, // false for TLS (587), true for SSL (465)
  auth: {
    user: "leelachaitanyadaddala@gmail.com",
    pass: "vdee albq moqd skef", // Use App Password if 2FA is enabled
  },
});

// ✅ Send OTP for Signup
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    // ✅ Remove any existing OTP for the email
    await OTP.deleteOne({ email });

    // ✅ Save the new OTP
    await OTP.create({ email, otp, expiresAt });

    // ✅ Send OTP via Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // ✅ Use environment variable
      to: email,
      subject: "Your OTP for Signup",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});


// ✅ Verify OTP before Signup
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ✅ Check OTP in database
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified. Proceed with signup." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    // ✅ Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token, user: { id: user._id, email: user.email, username: user.username } });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

// ✅ Signup Route (After OTP Verification)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    // ✅ Verify OTP
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    // ✅ Remove OTP after successful signup
    await OTP.deleteOne({ email });

    res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, email: newUser.email, username: newUser.username } });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
