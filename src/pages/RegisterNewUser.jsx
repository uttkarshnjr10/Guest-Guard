import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import styles from "./RegisterNewUser.module.css";

const sidebarLinks = [
  { to: "/regional-admin", label: "Dashboard", exact: true },
  { to: "/regional-admin/hotels", label: "Manage Hotels" },
  { to: "/regional-admin/access-logs", label: "Access Logs" },
];

const USER_TYPES = {
  HOTEL: "Hotel",
  POLICE: "Police Station",
};

function generateUsername(data, type) {
  if (type === USER_TYPES.HOTEL) {
    return `hotel_${data.name?.toLowerCase().replace(/\s+/g, '')}_${data.city?.toLowerCase().slice(0,3)}`;
  } else {
    return `police_${data.station?.toLowerCase().replace(/\s+/g, '')}_${data.city?.toLowerCase().slice(0,3)}`;
  }
}
function generateTempPassword() {
  // Simple strong random (not cryptographically secure)
  const chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
  return Array.from({length: 10}, ()=>chars[Math.floor(Math.random()*chars.length)]).join('');
}

export default function RegisterNewUser() {
  const [userType, setUserType] = useState(USER_TYPES.HOTEL);
  const [hotelData, setHotelData] = useState({
    name: "", city: "", address: "", license: "", contact: ""
  });
  const [policeData, setPoliceData] = useState({
    station: "", jurisdiction: "", city: "", contact: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if(type === USER_TYPES.HOTEL){
      setHotelData({...hotelData, [name]: value });
    } else {
      setPoliceData({...policeData, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Simulate creation and temp credential generation
    const data = userType === USER_TYPES.HOTEL ? hotelData : policeData;
    const username = generateUsername(data, userType);
    const password = generateTempPassword();
    setCredentials({ username, password });
    setSubmitted(true);
  };

  return (
    <>
      <Navbar username="Meera" role="Regional Admin" />
      <div className={styles.layoutWrapper}>
        <Sidebar links={sidebarLinks} />
        <main className={styles.mainContent}>
          <header>
            <h1>Register New User</h1>
          </header>

          <div className={styles.typeSwitchRow}>
            <label>
              <input
                type="radio"
                value={USER_TYPES.HOTEL}
                checked={userType === USER_TYPES.HOTEL}
                onChange={() => setUserType(USER_TYPES.HOTEL)}
              />{" "}
              Hotel
            </label>
            <label>
              <input
                type="radio"
                value={USER_TYPES.POLICE}
                checked={userType === USER_TYPES.POLICE}
                onChange={() => setUserType(USER_TYPES.POLICE)}
              />{" "}
              Police Station
            </label>
          </div>

          <form onSubmit={handleSubmit} className={styles.formBox}>
            {userType === USER_TYPES.HOTEL ? (
              <>
                <div className={styles.formRow}>
                  <label>Hotel Name *</label>
                  <input name="name" required value={hotelData.name}
                    onChange={e => handleChange(e, USER_TYPES.HOTEL)} />
                </div>
                <div className={styles.formRow}>
                  <label>Official Address *</label>
                  <input name="address" required value={hotelData.address}
                    onChange={e => handleChange(e, USER_TYPES.HOTEL)} />
                </div>
                <div className={styles.formRow}>
                  <label>City *</label>
                  <input name="city" required value={hotelData.city}
                    onChange={e => handleChange(e, USER_TYPES.HOTEL)} />
                </div>
                <div className={styles.formRow}>
                  <label>License Number *</label>
                  <input name="license" required value={hotelData.license}
                    onChange={e => handleChange(e, USER_TYPES.HOTEL)} />
                </div>
                <div className={styles.formRow}>
                  <label>Contact (email/phone) *</label>
                  <input name="contact" required value={hotelData.contact}
                    onChange={e => handleChange(e, USER_TYPES.HOTEL)} />
                </div>
              </>
            ) : (
              <>
                <div className={styles.formRow}>
                  <label>Station Name *</label>
                  <input name="station" required value={policeData.station}
                    onChange={e => handleChange(e, USER_TYPES.POLICE)} />
                </div>
                <div className={styles.formRow}>
                  <label>Jurisdiction *</label>
                  <input name="jurisdiction" required value={policeData.jurisdiction}
                    onChange={e => handleChange(e, USER_TYPES.POLICE)} />
                </div>
                <div className={styles.formRow}>
                  <label>City *</label>
                  <input name="city" required value={policeData.city}
                    onChange={e => handleChange(e, USER_TYPES.POLICE)} />
                </div>
                <div className={styles.formRow}>
                  <label>Contact (email/phone) *</label>
                  <input name="contact" required value={policeData.contact}
                    onChange={e => handleChange(e, USER_TYPES.POLICE)} />
                </div>
              </>
            )}

            <div className={styles.formActions}>
              <button className={styles.submitBtn} type="submit">
                Register
              </button>
            </div>
          </form>

          {submitted && credentials && (
            <div className={styles.credentialBox}>
              <h3>Credentials Generated</h3>
              <p>
                <b>Username:</b> <span className={styles.credentialData}>{credentials.username}</span>
              </p>
              <p>
                <b>Temporary Password:</b> <span className={styles.credentialData}>{credentials.password}</span>
              </p>
              <p className={styles.credentialInfo}>
                Please copy these credentials and deliver securely to the verified entity. <br />
                This password will only work for first login and must be changed.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
