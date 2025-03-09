// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
require("dotenv").config();

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
 // Allow frontend requests

// Connect to MongoDB (Fixed deprecations)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));
  const nodemailer = require("nodemailer");
  require("dotenv").config(); // Load environment variables
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // ✅ Use dotenv variable
      pass: process.env.EMAIL_PASS, // ✅ Use dotenv variable (App Password)
    },
  });
  
  module.exports = transporter;
  
// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
