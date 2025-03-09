import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import CSS
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};
    if (!email) tempErrors.email = "Email is required!";
    if (!password) tempErrors.password = "Password is required!";
    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

        toast.success("✅ Login Successful!", { position: "top-right", autoClose: 2000 }); // ✅ Show Popup
        
        setTimeout(() => navigate("/dashboard"), 2500);  // ✅ Redirect after popup
        
      } catch (err) {
        setErrors({ general: err.response?.data?.message || "Login failed!" });
        toast.error("❌ Login Failed!", { position: "top-right" }); // ❌ Show error popup
      }
    }
  };

  return (
    <div className="auth-page">
      <ToastContainer /> {/* ✅ Add Toast Container */}
      
      <div className="auth-info">
        <p>Manage all your tasks in one place!</p>
        <h1>Cloud-based Task Manager</h1>
      </div>

      <div className="auth-container">
        <div className="auth-box">
          <h2>Welcome back!</h2>
          <p>Keep all your credentials safe!</p>

          <form onSubmit={handleSubmit} method="post">
            <label>Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <label>Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error">{errors.password}</span>}

            {errors.general && <span className="error">{errors.general}</span>}

            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>

            <button type="submit" className="auth-button">Log in</button>
          </form>

          <p className="switch-auth">
            If not logged in, <Link to="/signup">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;