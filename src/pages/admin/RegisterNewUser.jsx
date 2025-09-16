// pages/admin/RegisterNewUser.jsx

import React, { useState, useEffect } from "react";
// Get data from prev page
import { useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";
import Select from 'react-select';
import styles from "./RegisterNewUser.module.css";
import { toast } from 'react-hot-toast';

const USER_TYPES = {
  HOTEL: "Hotel",
  POLICE: "Police",
};

const initialHotelState = { name: "", city: "", address: "", license: "", contact: "" };
const initialPoliceState = { station: "", jurisdiction: "", city: "", contact: "", policeStation: "" };

export default function RegisterNewUser() {
  // Get data
  const location = useLocation();
  const inquiryData = location.state?.inquiryData;

  const [userType, setUserType] = useState(USER_TYPES.HOTEL);
  const [formData, setFormData] = useState(initialHotelState);
  const [policeStations, setPoliceStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Pre-populate form
  useEffect(() => {
    if (inquiryData) {
      setUserType(USER_TYPES.HOTEL);

      setFormData({
        name: inquiryData.hotelName || "",
        city: inquiryData.district || "", // Using district for city
        address: inquiryData.fullAddress || "",
        license: inquiryData.gstNumber || "", // Using GST for license
        contact: inquiryData.email || "",
      });
    }
  }, [inquiryData]);

  useEffect(() => {
    const fetchPoliceStations = async () => {
      setStationsLoading(true);
      try {
        const { data } = await apiClient.get('/stations');
        const formattedStations = data.map(station => ({
          value: station._id,
          label: station.name
        }));
        setPoliceStations(formattedStations);
      } catch  {
        toast.error("Could not load police stations. Please refresh.");
        setError("Could not load police stations. Please refresh.");
      } finally {
        setStationsLoading(false);
      }
    };

    fetchPoliceStations();
  }, []);

  const handleTypeChange = (newUserType) => {
    if (inquiryData) {
      toast.error("Cannot change user type when approving an inquiry.");
      return;
    }
    setUserType(newUserType);
    const initialState = newUserType === USER_TYPES.HOTEL ? initialHotelState : initialPoliceState;
    setFormData(initialState);
    setError("");
    setSuccessData(null);
  };

  const handleSelectChange = (selectedOption) => {
    setFormData(prevData => ({ ...prevData, policeStation: selectedOption.value }));
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
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
    const toastId = toast.loading('Registering user...');

    const { policeStation, ...otherDetails } = formData;
    const payload = {
      role: userType,
      email: formData.contact,
      username: (formData.name || formData.station).toLowerCase().replace(/\s+/g, ''),
      details: otherDetails,
    };
    if (userType === USER_TYPES.POLICE) {
      if (!policeStation) {
        setError("Please select a police station.");
        setIsLoading(false);
        toast.error("Please select a police station.", { id: toastId });
        return;
      }
      payload.policeStation = policeStation;
    }

    try {
      const response = await apiClient.post('/users/register', payload);
      toast.success(response.data.message, { id: toastId });
      setSuccessData({
        message: "User Registered Successfully!",
        username: response.data.username,
        password: response.data.temporaryPassword
      });

      if (inquiryData) {
        try {
          await apiClient.post(`/inquiries/${inquiryData._id}/approve`);
        } catch (approveError) {
          console.error("Failed to mark inquiry as approved:", approveError);
          toast.error("User was registered, but failed to update inquiry status.");
        }
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred.";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.credentialBox}>
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
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formBox}>
          <header className={styles.header}>
            <h1>Register New User</h1>
          </header>

          <div className={styles.typeSwitchRow}>
            <label className={`${styles.typeLabel} ${userType === USER_TYPES.HOTEL ? styles.active : ''}`}>
              <input type="radio" value={USER_TYPES.HOTEL} checked={userType === USER_TYPES.HOTEL} onChange={() => handleTypeChange(USER_TYPES.HOTEL)} />
              Hotel
            </label>
            <label className={`${styles.typeLabel} ${userType === USER_TYPES.POLICE ? styles.active : ''}`}>
              <input type="radio" value={USER_TYPES.POLICE} checked={userType === USER_TYPES.POLICE} onChange={() => handleTypeChange(USER_TYPES.POLICE)} />
              Police Station
            </label>
          </div>

          {userType === USER_TYPES.HOTEL ? (
            <>
              <div className={styles.formRow}>
                <label>Hotel Name *</label>
                <input name="name" required value={formData.name} onChange={handleChange} className={styles.inputField} />
              </div>
              <div className={styles.formRow}>
                <label>Official Address *</label>
                <input name="address" required value={formData.address} onChange={handleChange} className={styles.inputField} />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <label>City *</label>
                  <input name="city" required value={formData.city} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formRow}>
                  <label>License Number *</label>
                  <input name="license" required value={formData.license} onChange={handleChange} className={styles.inputField} />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Contact Email *</label>
                <input name="contact" type="email" required value={formData.contact} onChange={handleChange} className={styles.inputField} />
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <label>Station Name *</label>
                  <input name="station" required value={formData.station} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formRow}>
                  <label>Jurisdiction *</label>
                  <input name="jurisdiction" required value={formData.jurisdiction} onChange={handleChange} className={styles.inputField} />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Assign to Police Station *</label>
                <Select
                  options={policeStations}
                  onChange={handleSelectChange}
                  isLoading={stationsLoading}
                  placeholder="Search and select a station..."
                  noOptionsMessage={() => 'No stations found.'}
                  classNamePrefix="react-select"
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <label>City *</label>
                  <input name="city" required value={formData.city} onChange={handleChange} className={styles.inputField} />
                </div>
                <div className={styles.formRow}>
                  <label>Contact Email *</label>
                  <input name="contact" type="email" required value={formData.contact} onChange={handleChange} className={styles.inputField} />
                </div>
              </div>
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formActions}>
            <button className={styles.submitBtn} type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register User'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}