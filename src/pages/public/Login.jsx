import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion"; 
import styles from "./Login.module.css";

// Helper function to decode JWT token
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Animation variants
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

  // Move handleSubmit here, not inside any other function or block
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      // Use apiClient instead of axios
      const response = await apiClient.post("/auth/login", { email, password });
      
      if (response.status === 202) {
        toast.dismiss(toastId);
        navigate("/reset-password", { state: { userId: response.data.userId } });
        return;
      }

      const { token } = response.data;
      if (!token) throw new Error("Login successful, but no token was provided.");

      localStorage.setItem("authToken", token);
      const decoded = decodeToken(token);

      if (decoded) {
        setAuth({ token, username: decoded.username, role: decoded.role });
        toast.success("Login successful!", { id: toastId });

        switch (decoded.role) {
          case "Hotel":
            navigate("/hotel");
            break;
          case "Police":
            navigate("/police");
            break;
          case "Regional Admin":
            navigate("/regional-admin");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error("Invalid token received. Please try again.", { id: toastId });
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Your account has been suspended. Please contact the administrator.", {
          id: toastId,
        });
      } else {
        toast.error(err.response?.data?.message || err.message || "An error occurred.", {
          id: toastId,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
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
          <h2>Centralized Data Management</h2>
          <p>Login with Your Provided Credential</p>
        </motion.div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label htmlFor="username">Email Address</label>
            <input
              id="username"
              name="username"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </motion.div>

          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </motion.div>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        <motion.button
          type="button"
          className={styles.homeBtn}
          onClick={() => navigate("/")}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ marginBottom: '1.1rem', marginTop: '0.8rem' }} // Adjusted margin-top to move slightly lower
        >
           ← Home
        </motion.button>

        
      </motion.div>
    </div>
  );
}