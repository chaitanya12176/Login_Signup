import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "", // ✅ Added OTP field
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // ✅ Step 1: Enter email, Step 2: Enter OTP & other details
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Send OTP
  const sendOTP = async () => {
    setError("");
    setMessage("");
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email: formData.email });
      setMessage("OTP sent to your email.");
      setStep(2); // ✅ Move to step 2 (Enter OTP & other details)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ✅ Handle Signup (Verify OTP & Register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      setMessage(response.data.message);
      setTimeout(() => setRedirect(true), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  useEffect(() => {
    if (redirect) navigate("/login");
  }, [redirect, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-info">
        <p>Join our platform and start managing your tasks efficiently!</p>
        <h1>Cloud-based Task Manager</h1>
      </div>

      <div className="auth-container">
        <div className="auth-box">
          <h2>{step === 1 ? "Verify Your Email" : "Create an Account"}</h2>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); sendOTP(); } : handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={step === 2} // ✅ Disable email field after OTP is sent
            />

            {step === 1 && (
              <button type="button" className="auth-button" onClick={sendOTP}>
                Send OTP
              </button>
            )}

            {step === 2 && (
              <>
                <label>OTP</label>
                <input
                  type="text"
                  name="otp"
                  className="auth-input"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />

                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  className="auth-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="auth-input"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button type="submit" className="auth-button">
                  Sign Up
                </button>
              </>
            )}
          </form>

          {error && <span className="error">{error}</span>}
          {message && <span className="success">{message}</span>}

          <p className="switch-auth">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;