// src/pages/public/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import styles from "./Login.module.css";
// Icons are still imported for input fields and password toggle
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

// Helper function to decode JWT token (unchanged)
const decodeToken = (token) => {
  if (!token || typeof token !== "string") {
    console.error("decodeToken received an invalid token:", token);
    return null;
  }
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Animation variants (unchanged)
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      
      if (response.status === 202) {
        toast.dismiss(toastId);
        navigate("/reset-password", { state: { userId: response.data.userId } });
        return;
      }

      const { token } = response.data.data;
      if (!token) throw new Error("Login successful, but no token was provided.");

      localStorage.setItem("authToken", token);
      const decoded = decodeToken(token);

      if (decoded) {
        setAuth({ token, username: decoded.username, role: decoded.role });
        toast.success("Login successful!", { id: toastId });

        switch (decoded.role) {
          case "Hotel": navigate("/hotel"); break;
          case "Police": navigate("/police"); break;
          case "Regional Admin": navigate("/regional-admin"); break;
          default: navigate("/");
        }
      } else {
        toast.error("Invalid token received. Please try again.", { id: toastId });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background circles remain unchanged */}
      <div className={`${styles.circle} ${styles.c1}`}></div>
      <div className={`${styles.circle} ${styles.c2}`}></div>
      <div className={`${styles.circle} ${styles.c3}`}></div>

      <motion.div
        className={styles.loginBox}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h2 className={styles.apnaManagerTitle}>ApnaManager</h2>
          <p>Login with Your Provided Credential</p>
        </motion.div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <motion.div className={styles.inputWrapper} variants={itemVariants}>
            <FiMail className={styles.inputIcon} />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </motion.div>

          <motion.div className={styles.inputWrapper} variants={itemVariants}>
            <FiLock className={styles.inputIcon} />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className={styles.passwordIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        {/* NEW: Re-added the Home Button */}
        <motion.button
          type="button"
          className={styles.homeBtn}
          onClick={() => navigate("/")}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Home
        </motion.button>

      </motion.div>
    </div>
  );
}