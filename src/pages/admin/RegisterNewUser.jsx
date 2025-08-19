import React, { useState } from "react";
import axios from "axios";
import styles from "./RegisterNewUser.module.css";

const USER_TYPES = {
  HOTEL: "Hotel",
  POLICE: "Police",
};

const initialHotelState = { name: "", city: "", address: "", license: "", contact: "" };
const initialPoliceState = { station: "", jurisdiction: "", city: "", contact: "" };

export default function RegisterNewUser() {
  const [userType, setUserType] = useState(USER_TYPES.HOTEL);
  const [formData, setFormData] = useState(initialHotelState);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const handleTypeChange = (newUserType) => {
    setUserType(newUserType);
    setFormData(newUserType === USER_TYPES.HOTEL ? initialHotelState : initialPoliceState);
    setError("");
    setSuccessData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleResetForm = () => {
    setSuccessData(null);
    setError("");
    setFormData(userType === USER_TYPES.HOTEL ? initialHotelState : initialPoliceState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessData(null);

    const payload = {
      role: userType,
      email: formData.contact,
      username: (formData.name || formData.station).toLowerCase().replace(/\s+/g, ''),
      details: { ...formData }
    };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("Admin not authenticated. Please log in again.");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/register`;
      const response = await axios.post(apiUrl, payload, config);

      // >> FIX: Use the success message from the API response
      setSuccessData({
        message: response.data.message, // "User created successfully. Credentials have been emailed."
        username: response.data.username,
        password: response.data.temporaryPassword
      });
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.credentialBox}>
          {/* >> Display the dynamic success message from the backend */}
          <h3>{successData.message}</h3>
          <p className={styles.credentialInfo}>
            The credentials are also displayed below as a backup.
          </p>
          <div className={styles.credentialRow}>
            <b>Username:</b>
            <div className={styles.credentialValue}>
              <span>{successData.username}</span>
              <button onClick={() => copyToClipboard(successData.username)} className={styles.copyBtn}>Copy</button>
            </div>
          </div>
          <div className={styles.credentialRow}>
            <b>Temp Password:</b>
            <div className={styles.credentialValue}>
              <span>{successData.password}</span>
              <button onClick={() => copyToClipboard(successData.password)} className={styles.copyBtn}>Copy</button>
            </div>
          </div>
          <button onClick={handleResetForm} className={styles.registerAnotherBtn}>
            Register Another User
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <header>
        <h1>Register New User</h1>
      </header>

      <div className={styles.typeSwitchRow}>
        <label className={userType === USER_TYPES.HOTEL ? styles.active : ''}>
          <input type="radio" value={USER_TYPES.HOTEL} checked={userType === USER_TYPES.HOTEL} onChange={() => handleTypeChange(USER_TYPES.HOTEL)} />
          Hotel
        </label>
        <label className={userType === USER_TYPES.POLICE ? styles.active : ''}>
          <input type="radio" value={USER_TYPES.POLICE} checked={userType === USER_TYPES.POLICE} onChange={() => handleTypeChange(USER_TYPES.POLICE)} />
          Police Station
        </label>
      </div>

      <form onSubmit={handleSubmit} className={styles.formBox}>
        {userType === USER_TYPES.HOTEL ? (
          <>
            <div className={styles.formRow}><label>Hotel Name *</label><input name="name" required value={formData.name} onChange={handleChange} /></div>
            <div className={styles.formRow}><label>Official Address *</label><input name="address" required value={formData.address} onChange={handleChange} /></div>
            <div className={styles.formRow}><label>City *</label><input name="city" required value={formData.city} onChange={handleChange} /></div>
            <div className={styles.formRow}><label>License Number *</label><input name="license" required value={formData.license} onChange={handleChange} /></div>
            <div className={styles.formRow}><label>Contact Email *</label><input name="contact" type="email" required value={formData.contact} onChange={handleChange} /></div>
          </>
        ) : (
          <>
            <div className={styles.formRow}><label>Station Name *</label><input name="station" required value={formData.station} onChange={handleChange} /></div>
            <div className={styles.formRow}><label>Jurisdiction *</label><input name="jurisdiction" required value={formData.jurisdiction} onChange={handleChange} /></div>
            <div className={styles.formRow}><label>City *</label><input name="city" required value={formData.city} onChange={handleChange} /></div>
            <div className={styles.formRow}><label>Contact Email *</label><input name="contact" type="email" required value={formData.contact} onChange={handleChange} /></div>
          </>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formActions}>
          <button className={styles.submitBtn} type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register User'}
          </button>
        </div>
      </form>
    </main>
  );
}
