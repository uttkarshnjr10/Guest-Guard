import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import styles from "./GuestRegistrationForm.module.css";
import { differenceInYears, parseISO, format } from "date-fns";
import { jsPDF } from "jspdf";

// Webcam Modal for live photo capture
const WebcamModal = ({ onCapture, onCancel }) => {
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <div className={styles.webcamOverlay}>
      <div className={styles.webcamContainer}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{ facingMode: "user" }}
        />
        <div className={styles.webcamControls}>
          <button type="button" onClick={capture} className={styles.captureBtn}>
            Capture Photo
          </button>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function GuestRegistrationForm({ onAddGuest }) {
  // Initial state for guests sub-objects
  const initialGuests = { adults: [], children: [] };

  // Initial form state
  const getInitialFormState = () => ({
    name: "",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: { state: "", district: "", city: "", pincode: "" },
    purpose: "",
    checkIn: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    expectedCheckout: "",
    roomNumber: "",
    idType: "",
    idNumber: "",
    idImage: null,
    livePhoto: null,
    guests: initialGuests,
    registrationTimestamp: new Date(),
  });

  // STATES
  const [form, setForm] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [captureFor, setCaptureFor] = useState(null); // {type:'main'|'adult'|'child', index}

  // --- Webcam Handlers ---
  const openWebcam = (type, index = null) => {
    setCaptureFor({ type, index });
    setIsWebcamOpen(true);
  };

  const handleCapture = (imageSrc) => {
    if (!captureFor) return;
    const { type, index } = captureFor;
    if (type === "main") {
      setForm((prev) => ({ ...prev, livePhoto: imageSrc }));
      setErrors((prev) => ({ ...prev, livePhoto: null }));
    } else if (type === "adult") {
      handleOtherAdultChange(index, "livePhoto", imageSrc);
    } else if (type === "child") {
      handleChildChange(index, "livePhoto", imageSrc);
    }
    setIsWebcamOpen(false);
    setCaptureFor(null);
  };

  // --- General Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addrKey = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [addrKey]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, [fieldName]: file }));
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
  };

  const handleDobChange = (e) => {
    const dobVal = e.target.value;
    try {
      const ageYears = differenceInYears(new Date(), parseISO(dobVal));
      setForm((prev) => ({ ...prev, dob: dobVal, age: ageYears.toString() }));
      setErrors((prev) => ({ ...prev, dob: null }));
    } catch {
      setForm((prev) => ({ ...prev, dob: dobVal, age: "" }));
    }
  };

  // --- Other Adults Handlers ---
  const addOtherAdult = () =>
    setForm((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        adults: [
          ...prev.guests.adults,
          { name: "", dob: "", age: "", idType: "", idNumber: "", idImage: null, livePhoto: null },
        ],
      },
    }));

  const removeOtherAdult = (idx) =>
    setForm((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        adults: prev.guests.adults.filter((_, i) => i !== idx),
      },
    }));

  const handleOtherAdultChange = (index, key, value) => {
    setForm((prev) => {
      const adults = [...prev.guests.adults];
      adults[index] = { ...adults[index], [key]: value };
      if (key === "dob" && value) {
        try {
          adults[index].age = differenceInYears(new Date(), parseISO(value)).toString();
        } catch {
          adults[index].age = "";
        }
      }
      return { ...prev, guests: { ...prev.guests, adults } };
    });
    if (key !== "dob") setErrors((prev) => ({ ...prev, [`adult_${key}_${index}`]: null }));
  };

  const handleOtherAdultFileChange = (idx, e, fieldName) =>
    handleOtherAdultChange(idx, fieldName, e.target.files[0]);

  // --- Children Handlers ---
  const addChild = () =>
    setForm((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        children: [
          ...prev.guests.children,
          { name: "", dob: "", age: "", idType: "", idNumber: "", idImage: null, livePhoto: null },
        ],
      },
    }));

  const removeChild = (idx) =>
    setForm((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        children: prev.guests.children.filter((_, i) => i !== idx),
      },
    }));

  const handleChildChange = (index, key, value) => {
    setForm((prev) => {
      const children = [...prev.guests.children];
      children[index] = { ...children[index], [key]: value };
      if (key === "dob" && value) {
        try {
          children[index].age = differenceInYears(new Date(), parseISO(value)).toString();
        } catch {
          children[index].age = "";
        }
      }
      return { ...prev, guests: { ...prev.guests, children } };
    });
    if (key !== "dob") setErrors((prev) => ({ ...prev, [`child_${key}_${index}`]: null }));
  };

  const handleChildFileChange = (idx, e, fieldName) => handleChildChange(idx, fieldName, e.target.files[0]);

  // --- Validation function ---
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.dob) errs.dob = "DOB is required";
    if (!form.gender) errs.gender = "Gender is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";

    ["state", "district", "city", "pincode"].forEach((field) => {
      if (!form.address[field].trim())
        errs[`address.${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    });

    if (!form.purpose.trim()) errs.purpose = "Purpose is required";
    if (!form.checkIn) errs.checkIn = "Check-in time is required";
    if (!form.expectedCheckout) errs.expectedCheckout = "Expected checkout is required";
    if (!form.roomNumber.trim()) errs.roomNumber = "Room number is required";
    if (!form.idType) errs.idType = "ID type is required";
    if (!form.idNumber.trim()) errs.idNumber = "ID number is required";
    if (!form.idImage) errs.idImage = "ID image is required";
    if (!form.livePhoto) errs.livePhoto = "Live photo is required";

    form.guests.adults.forEach((g, idx) => {
      if (!g.name || !g.name.trim()) errs[`adult_name_${idx}`] = "Name required";
      if (!g.dob) errs[`adult_dob_${idx}`] = "DOB is required";
      if (!g.idType) errs[`adult_idType_${idx}`] = "ID proof type is required";
      if (!g.idNumber || !g.idNumber.trim()) errs[`adult_idNumber_${idx}`] = "ID number is required";
      if (!g.livePhoto) errs[`adult_livePhoto_${idx}`] = "Live photo is required";
      if (!g.idImage) errs[`adult_idImage_${idx}`] = "ID image is required";
    });

    form.guests.children.forEach((c, idx) => {
      if (!c.name || !c.name.trim()) errs[`child_name_${idx}`] = "Name required";
      if (!c.dob) errs[`child_dob_${idx}`] = "DOB is required";
      if (c.age >= 14) {
        if (!c.idType) errs[`child_idType_${idx}`] = "ID proof type is required";
        if (!c.idImage) errs[`child_idImage_${idx}`] = "ID image is required";
      }
      if (!c.livePhoto) errs[`child_livePhoto_${idx}`] = "Live photo is required";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // --- Generate PDF E-Receipt ---
  const generatePdfAndSend = () => {
    if (!onAddGuest) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("GuestGuard Hotel Receipt", 20, 20);

    // Main guest details
    doc.setFontSize(12);
    doc.text(`Name: ${form.name}`, 20, 40);
    doc.text(`Age: ${form.age}`, 20, 50);
    doc.text(`Gender: ${form.gender}`, 20, 60);
    doc.text(
      `Address: ${form.address.city}, ${form.address.district}, ${form.address.state} - ${form.address.pincode}`,
      20,
      70
    );
    doc.text(`Purpose: ${form.purpose}`, 20, 80);
    doc.text(`Check-in: ${form.checkIn.replace("T", " ")}`, 20, 90);
    doc.text(`Expected Checkout: ${form.expectedCheckout.replace("T", " ")}`, 20, 100);
    doc.text(`Room Number: ${form.roomNumber}`, 20, 110);
    doc.text(`Phone: ${form.phone}`, 20, 120);
    if (form.email) doc.text(`Email: ${form.email}`, 20, 130);

    doc.text(
      `Guests: Adults ${form.guests.adults.length}, Children ${form.guests.children.length}`,
      20,
      140
    );

    if (form.guests.adults.length) {
      doc.text("Other Adults:", 20, 150);
      form.guests.adults.forEach((g, i) => {
        doc.text(`- ${g.name} (${g.age})`, 25, 160 + i * 10);
      });
    }
    if (form.guests.children.length) {
      doc.text("Children:", 20, 160 + form.guests.adults.length * 10 + 10);
      form.guests.children.forEach((g, i) => {
        doc.text(`- ${g.name} (${g.age})`, 25, 170 + form.guests.adults.length * 10 + i * 10);
      });
    }

    doc.text("Thank you for choosing GuestGuard!", 20, 200);

    doc.save(`GuestReceipt_${form.name.replace(/\s+/g, "_")}_${Date.now()}.pdf`);

    // Simulate sending receipt or SMS by alert
    alert(`E-receipt generated and downloaded.\nSend this receipt to phone: ${form.phone} (Demo).`);
  };

  // --- Form submit ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const timestamp = new Date();
    const guestPayload = { ...form, registrationTimestamp: timestamp.toISOString() };

    onAddGuest && onAddGuest(guestPayload);

    generatePdfAndSend();

    setForm(getInitialFormState());
    setErrors({});
  };

  // --- Render ---
  return (
    <>
      {isWebcamOpen && (
        <WebcamModal
          onCapture={handleCapture}
          onCancel={() => setIsWebcamOpen(false)}
        />
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* MAIN GUEST DETAILS */}
        <fieldset>
          <legend>Main Guest Details</legend>
          <div className={styles.row}>
            <label>
              Full Name *
              <input type="text" name="name" value={form.name} onChange={handleChange} />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </label>
            <label>
              Date of Birth *
              <input
                type="date"
                name="dob"
                max={format(new Date(), "yyyy-MM-dd")}
                value={form.dob}
                onChange={handleDobChange}
              />
              {errors.dob && <span className={styles.error}>{errors.dob}</span>}
            </label>
            <label>
              Age
              <input type="number" name="age" value={form.age} readOnly />
            </label>
            <label>
              Gender *
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <span className={styles.error}>{errors.gender}</span>}
            </label>
          </div>
        </fieldset>

        {/* ID & LIVE PHOTO (MAIN GUEST) */}
        <fieldset>
          <legend>ID & Photo Proof (Main Guest)</legend>
          <div className={styles.row}>
            <label>
              ID Proof Type *
              <select name="idType" value={form.idType} onChange={handleChange}>
                <option value="">Select</option>
                <option>Aadhaar</option>
                <option>Passport</option>
                <option>Voter ID</option>
                <option>Driving License</option>
              </select>
              {errors.idType && <span className={styles.error}>{errors.idType}</span>}
            </label>
            <label>
              ID Number *
              <input type="text" name="idNumber" value={form.idNumber} onChange={handleChange} />
              {errors.idNumber && <span className={styles.error}>{errors.idNumber}</span>}
            </label>
          </div>
          <div className={styles.row}>
            <label>
              Upload ID Image *
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "idImage")}
              />
              {errors.idImage && <span className={styles.error}>{errors.idImage}</span>}
            </label>

            <div className={styles.livePhotoContainer}>
              <label>Live Photo *</label>
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => openWebcam("main")}
              >
                Take Live Photo
              </button>
              {form.livePhoto && (
                <img
                  src={form.livePhoto}
                  alt="Live Preview"
                  className={styles.photoPreviewCompact} /* small thumbnail */
                />
              )}
              {errors.livePhoto && <span className={styles.error}>{errors.livePhoto}</span>}
            </div>
          </div>
        </fieldset>

        {/* ADDRESS */}
        <fieldset>
          <legend>Address *</legend>
          <div className={styles.row}>
            <label>
              State *
              <input type="text" name="address.state" value={form.address.state} onChange={handleChange} />
              {errors["address.state"] && <span className={styles.error}>{errors["address.state"]}</span>}
            </label>
            <label>
              District *
              <input type="text" name="address.district" value={form.address.district} onChange={handleChange} />
              {errors["address.district"] && <span className={styles.error}>{errors["address.district"]}</span>}
            </label>
            <label>
              City *
              <input type="text" name="address.city" value={form.address.city} onChange={handleChange} />
              {errors["address.city"] && <span className={styles.error}>{errors["address.city"]}</span>}
            </label>
            <label>
              Pin Code *
              <input type="text" name="address.pincode" value={form.address.pincode} onChange={handleChange} />
              {errors["address.pincode"] && <span className={styles.error}>{errors["address.pincode"]}</span>}
            </label>
          </div>
        </fieldset>

        {/* Purpose */}
        <label>
          Purpose of Visit *
          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            rows={2}
            placeholder="Why did you come to this area?"
          />
          {errors.purpose && <span className={styles.error}>{errors.purpose}</span>}
        </label>

        {/* Check-in and Expected Checkout */}
        <div className={styles.row}>
          <label>
            Check-In Time *
            <input type="datetime-local" name="checkIn" value={form.checkIn} onChange={handleChange} />
            {errors.checkIn && <span className={styles.error}>{errors.checkIn}</span>}
          </label>
          <label>
            Expected Checkout *
            <input type="datetime-local" name="expectedCheckout" value={form.expectedCheckout} onChange={handleChange} />
            {errors.expectedCheckout && <span className={styles.error}>{errors.expectedCheckout}</span>}
          </label>
        </div>

        {/* Room Number */}
        <label>
          Allocated Hotel Room Number *
          <input type="text" name="roomNumber" value={form.roomNumber} onChange={handleChange} />
          {errors.roomNumber && <span className={styles.error}>{errors.roomNumber}</span>}
        </label>

        {/* Contact Phones */}
        <div className={styles.row}>
          <label>
            Phone Number *
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </label>
          <label>
            Email (optional)
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </label>
        </div>

        {/* Other Adults */}
        <fieldset>
          <legend>Other Accompanying Adults</legend>
          {form.guests.adults.map((guest, idx) => (
            <div key={idx} className={styles.guestDetailsRow}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeOtherAdult(idx)}
                title="Remove Adult"
              >
                Remove
              </button>

              <label>
                Name *
                <input
                  type="text"
                  value={guest.name || ""}
                  onChange={(e) => handleOtherAdultChange(idx, "name", e.target.value)}
                />
                {errors[`adult_name_${idx}`] && (
                  <span className={styles.error}>{errors[`adult_name_${idx}`]}</span>
                )}
              </label>

              <label>
                Date of Birth *
                <input
                  type="date"
                  max={format(new Date(), "yyyy-MM-dd")}
                  value={guest.dob || ""}
                  onChange={(e) => handleOtherAdultChange(idx, "dob", e.target.value)}
                />
                {errors[`adult_dob_${idx}`] && (
                  <span className={styles.error}>{errors[`adult_dob_${idx}`]}</span>
                )}
              </label>

              <label>
                Age
                <input type="number" value={guest.age || ""} readOnly />
              </label>

              <label>
                Gender *
                <select
                  value={guest.gender || ""}
                  onChange={(e) => handleOtherAdultChange(idx, "gender", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                {errors[`adult_gender_${idx}`] && (
                  <span className={styles.error}>{errors[`adult_gender_${idx}`]}</span>
                )}
              </label>

              <label>
                ID Proof Type *
                <select
                  value={guest.idType || ""}
                  onChange={(e) => handleOtherAdultChange(idx, "idType", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Aadhaar</option>
                  <option>Passport</option>
                  <option>Voter ID</option>
                  <option>Driving License</option>
                </select>
                {errors[`adult_idType_${idx}`] && (
                  <span className={styles.error}>{errors[`adult_idType_${idx}`]}</span>
                )}
              </label>

              <label>
                ID Number *
                <input
                  type="text"
                  value={guest.idNumber || ""}
                  onChange={(e) => handleOtherAdultChange(idx, "idNumber", e.target.value)}
                />
                {errors[`adult_idNumber_${idx}`] && (
                  <span className={styles.error}>{errors[`adult_idNumber_${idx}`]}</span>
                )}
              </label>

              <label>
                Upload ID Image *
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleOtherAdultFileChange(idx, e, "idImage")}
                />
                {errors[`adult_idImage_${idx}`] && (
                  <span className={styles.error}>{errors[`adult_idImage_${idx}`]}</span>
                )}
              </label>

              <div className={styles.livePhotoContainer}>
                <label>Live Photo *</label>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => openWebcam("adult", idx)}
                >
                  Take Live Photo
                </button>
                {guest.livePhoto && (
                  <img
                    src={guest.livePhoto}
                    alt="Adult Live"
                    className={styles.photoPreviewCompact}
                  />
                )}
                {errors[`adult_livePhoto_${idx}`] && (
                  <span className={styles.error}>{errors[`adult_livePhoto_${idx}`]}</span>
                )}
              </div>
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addOtherAdult}>
            + Add Adult
          </button>
        </fieldset>

        {/* Children Section */}
        <fieldset>
          <legend>Accompanying Children</legend>
          {form.guests.children.map((child, idx) => (
            <div key={idx} className={styles.guestDetailsRow}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeChild(idx)}
                title="Remove Child"
              >
                Remove
              </button>

              <label>
                Child's Name *
                <input
                  type="text"
                  value={child.name || ""}
                  onChange={(e) => handleChildChange(idx, "name", e.target.value)}
                />
                {errors[`child_name_${idx}`] && (
                  <span className={styles.error}>{errors[`child_name_${idx}`]}</span>
                )}
              </label>

              <label>
                Date of Birth *
                <input
                  type="date"
                  max={format(new Date(), "yyyy-MM-dd")}
                  value={child.dob || ""}
                  onChange={(e) => handleChildChange(idx, "dob", e.target.value)}
                />
                {errors[`child_dob_${idx}`] && (
                  <span className={styles.error}>{errors[`child_dob_${idx}`]}</span>
                )}
              </label>

              <label>
                Age
                <input type="number" value={child.age || ""} readOnly />
              </label>

              <label>
                Gender *
                <select
                  value={child.gender || ""}
                  onChange={(e) => handleChildChange(idx, "gender", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                {errors[`child_gender_${idx}`] && (
                  <span className={styles.error}>{errors[`child_gender_${idx}`]}</span>
                )}
              </label>

              {/* Conditional ID for age >= 14 */}
              {parseInt(child.age) >= 14 && (
                <>
                  <label>
                    ID Type *
                    <select
                      value={child.idType || ""}
                      onChange={(e) => handleChildChange(idx, "idType", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Aadhaar</option>
                      <option>School ID</option>
                      <option>Passport</option>
                    </select>
                    {errors[`child_idType_${idx}`] && (
                      <span className={styles.error}>{errors[`child_idType_${idx}`]}</span>
                    )}
                  </label>

                  <label>
                    Upload ID Image *
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChildFileChange(idx, e, "idImage")}
                    />
                    {errors[`child_idImage_${idx}`] && (
                      <span className={styles.error}>{errors[`child_idImage_${idx}`]}</span>
                    )}
                  </label>
                </>
              )}

              <div className={styles.livePhotoContainer}>
                <label>Live Photo *</label>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => openWebcam("child", idx)}
                >
                  Take Live Photo
                </button>
                {child.livePhoto && (
                  <img
                    src={child.livePhoto}
                    alt="Child Live"
                    className={styles.photoPreviewCompact}
                  />
                )}
                {errors[`child_livePhoto_${idx}`] && (
                  <span className={styles.error}>{errors[`child_livePhoto_${idx}`]}</span>
                )}
              </div>
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addChild}>
            + Add Child
          </button>
        </fieldset>

        <button type="submit" className={styles.submitBtn}>
          Register Guest
        </button>
      </form>
    </>
  );
}
