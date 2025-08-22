import React, { useState, useRef, useCallback, useEffect } from "react"; // 1. Imported useEffect
import Webcam from "react-webcam";
import styles from "./GuestRegistrationForm.module.css";
import { toast } from 'react-hot-toast';
import { differenceInYears, parseISO, format } from "date-fns";
import apiClient from "../../api/apiClient"; // 2. Imported apiClient

// Helper Function: Converts a dataURL (from webcam) to a File object
function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// 3. ADDED: Component to display the AI verification status
const VerificationStatus = ({ status }) => {
  if (!status.state) return null;

  if (status.state === 'verifying') {
    return <div className={styles.statusVerifying}>🔎 Verifying ID...</div>;
  }
  if (status.state === 'success') {
    return <div className={styles.statusSuccess}>✅ {status.message}</div>;
  }
  if (status.state === 'failed') {
    return <div className={styles.statusFailed}>⚠️ {status.message}</div>;
  }
  return null;
};


// Webcam Modal for live photo capture
const WebcamModal = ({ onCapture, onCancel, videoConstraints }) => { // Added videoConstraints prop
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // Create a ref for the canvas

  const capture = useCallback(() => {
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;
    if (webcam && canvas) {
      const video = webcam.video;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      // Get the image data from the canvas
      const imageSrc = canvas.toDataURL('image/jpeg');
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  return (
    <div className={styles.webcamOverlay}>
      <div className={styles.webcamContainer}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={videoConstraints}
        />
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
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
  // Your initial state functions remain the same
  const initialGuests = { adults: [], children: [] };
  const getInitialFormState = () => ({
    name: "", dob: "", age: "", gender: "", phone: "", email: "",
    address: { state: "", district: "", city: "", pincode: "" },
    purpose: "", checkIn: format(new Date(), "yyyy-MM-dd'T'HH:mm"), expectedCheckout: "",
    roomNumber: "", idType: "", idNumber: "", idImageFront: null,
    idImageBack: null, livePhoto: null, guests: initialGuests,
    registrationTimestamp: new Date(),
  });

  // STATES
  const [form, setForm] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [captureFor, setCaptureFor] = useState(null);

  //  State to manage the AI verification process
  const [verification, setVerification] = useState({ state: null, message: '' });

  // --- Webcam Handlers ---
  const openWebcam = (type, index = null) => {
    setCaptureFor({ type, index });
    setIsWebcamOpen(true);
  };

  {/* MODIFICATION A: Part 1 - Updated handleCapture function */}
  const handleCapture = (imageSrc) => {
    if (!captureFor) return;
    const { type, index } = captureFor;
  
    if (type === "main") {
      setForm((prev) => ({ ...prev, livePhoto: imageSrc }));
      setErrors((prev) => ({ ...prev, livePhoto: null }));
    }
    else if (type === "idFront") {
      setVerification({ state: null, message: '' });
      setForm((prev) => ({ ...prev, idImageFront: imageSrc }));
      setErrors((prev) => ({ ...prev, idImageFront: null }));
    }
    else if (type === "idBack") {
      setForm((prev) => ({ ...prev, idImageBack: imageSrc }));
      setErrors((prev) => ({ ...prev, idImageBack: null }));
    }
    // ADDED THESE NEW HANDLERS
    else if (type === "adultIdFront") {
      handleOtherAdultChange(index, "idImageFront", imageSrc);
    } else if (type === "adultIdBack") {
      handleOtherAdultChange(index, "idImageBack", imageSrc);
    } else if (type === "childIdFront") {
      handleChildChange(index, "idImageFront", imageSrc);
    } else if (type === "childIdBack") {
      handleChildChange(index, "idImageBack", imageSrc);
    }
    // The existing adult and child handlers are for live photos
    else if (type === "adult") {
      handleOtherAdultChange(index, "livePhoto", imageSrc);
    } else if (type === "child") {
      handleChildChange(index, "livePhoto", imageSrc);
    }
  
    setIsWebcamOpen(false);
    setCaptureFor(null);
  };

  // 5. ADDED: useEffect for real-time ID verification
  useEffect(() => {
    const verifyNameAndId = async () => {
      // Trigger only when we have both a name and a front ID image
      if (form.idImageFront && form.name) {
        setVerification({ state: 'verifying', message: '' });
        try {
          // Step 1: Upload the captured image to get a URL
          const imageFile = dataURLtoFile(form.idImageFront, 'id_front.jpg');
          const formData = new FormData();
          formData.append('image', imageFile);

          const uploadRes = await apiClient.post('/upload/single-image', formData);
          const { imageUrl } = uploadRes.data;

          if (!imageUrl) {
            throw new Error('Image URL not received from server.');
          }

          // Step 2: Call the verification endpoint with the image URL and name
          const verifyRes = await apiClient.post('/verify/id-text', {
            imageUrl,
            nameEntered: form.name
          });

          const { match, message } = verifyRes.data;
          setVerification({
              state: match ? 'success' : 'failed',
              message: message
          });

        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Verification failed.';
          setVerification({ state: 'failed', message: errorMessage });
          toast.error(errorMessage);
        }
      }
    };
    
    // Debounce to avoid firing on every keystroke
    const timer = setTimeout(() => {
        verifyNameAndId();
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer

  }, [form.idImageFront, form.name]);


  // --- All your other handler functions (handleChange, handleDobChange, adults, children, validate, handleSubmit) remain unchanged ---
  // ...
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

  {/* MODIFICATION A: Part 2 - Updated initial state for new guests */}
  const addOtherAdult = () =>
    setForm((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        adults: [
          ...prev.guests.adults,
          // Add idImageFront and idImageBack
          { name: "", dob: "", age: "", idType: "", idNumber: "", idImageFront: null, idImageBack: null, livePhoto: null },
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


  const addChild = () =>
    setForm((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        children: [
          ...prev.guests.children,
          // Add idImageFront and idImageBack
          { name: "", dob: "", age: "", idType: "", idNumber: "", idImageFront: null, idImageBack: null, livePhoto: null },
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


  {/* MODIFICATION C: Part 1 - Updated validate function */}
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.dob) errs.dob = "DOB is required";
    if (!form.gender) errs.gender = "Gender is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.email.trim()) errs.email = "Email is required";

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
    if (!form.idImageFront) errs.idImageFront = "Front of ID is required";
    if (!form.idImageBack) errs.idImageBack = "Back of ID is required";
    if (!form.livePhoto) errs.livePhoto = "Live photo is required";

    form.guests.adults.forEach((g, idx) => {
      if (!g.name || !g.name.trim()) errs[`adult_name_${idx}`] = "Name required";
      if (!g.dob) errs[`adult_dob_${idx}`] = "DOB is required";
      if (!g.idType) errs[`adult_idType_${idx}`] = "ID proof type is required";
      if (!g.idNumber || !g.idNumber.trim()) errs[`adult_idNumber_${idx}`] = "ID number is required";
      if (!g.livePhoto) errs[`adult_livePhoto_${idx}`] = "Live photo is required";
      // REPLACE the idImage check with these two:
      if (!g.idImageFront) errs[`adult_idImageFront_${idx}`] = "ID front is required";
      if (!g.idImageBack) errs[`adult_idImageBack_${idx}`] = "ID back is required";
    });

    form.guests.children.forEach((c, idx) => {
      if (!c.name || !c.name.trim()) errs[`child_name_${idx}`] = "Name required";
      if (!c.dob) errs[`child_dob_${idx}`] = "DOB is required";
      if (c.age >= 10) {
        if (!c.idType) errs[`child_idType_${idx}`] = "ID proof type is required";
        // REPLACE the idImage check with these two:
        if (!c.idImageFront) errs[`child_idImageFront_${idx}`] = "ID front is required";
        if (!c.idImageBack) errs[`child_idImageBack_${idx}`] = "ID back is required";
      }
      if (!c.livePhoto) errs[`child_livePhoto_${idx}`] = "Live photo is required";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  {/* MODIFICATION C: Part 2 - Updated handleSubmit function */}
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const toastId = toast.loading("Registering guest...");

    try {
      const formData = new FormData();

      // Append primary guest data
      formData.append('primaryGuestName', form.name);
      formData.append('primaryGuestDob', form.dob);
      formData.append('primaryGuestGender', form.gender);
      formData.append('primaryGuestPhone', form.phone);
      formData.append('primaryGuestEmail', form.email);
      formData.append('primaryGuestAddress', `${form.address.city}, ${form.address.district}, ${form.address.state} - ${form.address.pincode}`);
      formData.append('idType', form.idType);
      formData.append('idNumber', form.idNumber);

      // Append files
      formData.append('idImageFront', dataURLtoFile(form.idImageFront, 'idImageFront.jpg'));
      formData.append('idImageBack', dataURLtoFile(form.idImageBack, 'idImageBack.jpg'));
      formData.append('livePhoto', dataURLtoFile(form.livePhoto, 'livePhoto.jpg'));

      // Append stay details
      formData.append('purposeOfVisit', form.purpose);
      formData.append('checkIn', form.checkIn);
      formData.append('expectedCheckout', form.expectedCheckout);
      formData.append('roomNumber', form.roomNumber);

      // ADD logic to append accompanying guest images
      form.guests.adults.forEach((adult, index) => {
        if (adult.idImageFront) formData.append(`adult_${index}_idImageFront`, dataURLtoFile(adult.idImageFront, `adult_${index}_idFront.jpg`));
        if (adult.idImageBack) formData.append(`adult_${index}_idImageBack`, dataURLtoFile(adult.idImageBack, `adult_${index}_idBack.jpg`));
      });

      form.guests.children.forEach((child, index) => {
        if (child.idImageFront) formData.append(`child_${index}_idImageFront`, dataURLtoFile(child.idImageFront, `child_${index}_idFront.jpg`));
        if (child.idImageBack) formData.append(`child_${index}_idImageBack`, dataURLtoFile(child.idImageBack, `child_${index}_idBack.jpg`));
      });

      // Append accompanying guests as a JSON string
      formData.append('accompanyingGuests', JSON.stringify(form.guests));

      const response = await apiClient.post('/guests/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message || "Guest registered successfully!", { id: toastId });

      // Reset form and call external handler
      onAddGuest && onAddGuest(); // Assuming onAddGuest is for refreshing lists
      setForm(getInitialFormState());
      setErrors({});

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to register guest.";
      toast.error(errorMessage, { id: toastId });
      console.error("Guest registration failed:", error);
    }
  };
  // ...
  
  // Determine camera facing mode based on capture type
  const getCameraFacingMode = () => {
    if (captureFor?.type.includes('id')) { // Simplified logic for all ID captures
      return "environment"; // Use back camera for documents
    }
    return "user"; // Use front camera for selfies
  };

  // --- Render ---
  return (
    <>
      {isWebcamOpen && (
        <WebcamModal
          onCapture={handleCapture}
          onCancel={() => setIsWebcamOpen(false)}
          videoConstraints={{ facingMode: getCameraFacingMode() }}
        />
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* MAIN GUEST DETAILS */}
        <fieldset>
          <legend>Main Guest Details</legend>
          {/* ...your existing name, dob, age, gender fields... */}
          <div className={styles.row}>
            <label>
              Full Name *
              <input type="text" name="name" value={form.name} onChange={handleChange} />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </label>
            <label>
              Date of Birth *
              <input type="date" name="dob" max={format(new Date(), "yyyy-MM-dd")} value={form.dob} onChange={handleDobChange}/>
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
              {/*...your ID type and number fields...*/}
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
            <div className={styles.livePhotoContainer}>
              <label>ID Proof Front *</label>
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => openWebcam("idFront")}
              >
                Capture Front
              </button>
              {form.idImageFront && (
                <img
                  src={form.idImageFront}
                  alt="ID Front Preview"
                  className={styles.photoPreviewCompact}
                />
              )}
              {errors.idImageFront && <span className={styles.error}>{errors.idImageFront}</span>}
              
              {/* 6. ADDED: Display the verification status here */}
              <VerificationStatus status={verification} />
            </div>
            
            {/*...your existing ID back and Live Photo sections...*/}
            <div className={styles.livePhotoContainer}>
              <label>ID Proof Back *</label>
              <button type="button" className={styles.addBtn} onClick={() => openWebcam("idBack")}>
                Capture Back
              </button>
              {form.idImageBack && (
                <img src={form.idImageBack} alt="ID Back Preview" className={styles.photoPreviewCompact}/>
              )}
              {errors.idImageBack && <span className={styles.error}>{errors.idImageBack}</span>}
            </div>

            <div className={styles.livePhotoContainer}>
              <label>Live Photo *</label>
              <button type="button" className={styles.addBtn} onClick={() => openWebcam("main")}>
                Take Live Photo
              </button>
              {form.livePhoto && (
                <img src={form.livePhoto} alt="Live Preview" className={styles.photoPreviewCompact}/>
              )}
              {errors.livePhoto && <span className={styles.error}>{errors.livePhoto}</span>}
            </div>
          </div>
        </fieldset>

        {/* --- All other fieldsets (Address, Purpose, Adults, Children) and the submit button remain exactly the same. --- */}
        {/* ... */}
       <fieldset>
 <legend>Address *</legend>
 <div className={styles.row}>
   <label>
     State *
     <input
       type="text"
       name="address.state"
       value={form.address.state}
       onChange={handleChange}
     />
     {errors["address.state"] && (
       <span className={styles.error}>{errors["address.state"]}</span>
     )}
   </label>
   <label>
     District *
     <input
       type="text"
       name="address.district"
       value={form.address.district}
       onChange={handleChange}
     />
     {errors["address.district"] && (
       <span className={styles.error}>{errors["address.district"]}</span>
     )}
   </label>
   <label>
     City *
     <input
       type="text"
       name="address.city"
       value={form.address.city}
       onChange={handleChange}
     />
     {errors["address.city"] && (
       <span className={styles.error}>{errors["address.city"]}</span>
     )}
   </label>
   <label>
     Pin Code *
     <input
       type="text"
       name="address.pincode"
       value={form.address.pincode}
       onChange={handleChange}
     />
     {errors["address.pincode"] && (
       <span className={styles.error}>{errors["address.pincode"]}</span>
     )}
   </label>
 </div>
</fieldset>
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
<div className={styles.row}>
  <label>
    Check-In Time *
    <input
      type="datetime-local"
      name="checkIn"
      value={form.checkIn}
      onChange={handleChange}
    />
    {errors.checkIn && <span className={styles.error}>{errors.checkIn}</span>}
  </label>
  <label>
    Expected Checkout *
    <input
      type="datetime-local"
      name="expectedCheckout"
      value={form.expectedCheckout}
      onChange={handleChange}
    />
    {errors.expectedCheckout && (
      <span className={styles.error}>{errors.expectedCheckout}</span>
    )}
  </label>
</div>
<label>
  Allocated Hotel Room Number *
  <input
    type="text"
    name="roomNumber"
    value={form.roomNumber}
    onChange={handleChange}
  />
  {errors.roomNumber && (
    <span className={styles.error}>{errors.roomNumber}</span>
  )}
</label>
<div className={styles.row}>
  <label>
    Phone Number *
    <input
      type="tel"
      name="phone"
      value={form.phone}
      onChange={handleChange}
    />
    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
  </label>
  <label>
    Email *
    <input
      type="email"
      name="email"
      value={form.email}
      onChange={handleChange}
    />
    {errors.email && <span className={styles.error}>{errors.email}</span>}
  </label>
</div>
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
          onChange={(e) =>
            handleOtherAdultChange(idx, "idNumber", e.target.value)
          }
        />
        {errors[`adult_idNumber_${idx}`] && (
          <span className={styles.error}>{errors[`adult_idNumber_${idx}`]}</span>
        )}
      </label>

      {/* MODIFICATION B: Part 1 - Replaced file upload with webcam buttons for Adults */}
      {/* REMOVED the existing "Upload ID Image" label and input */}
      {/* ADDED these two blocks instead */}
      <div className={styles.livePhotoContainer}>
        <label>ID Front *</label>
        <button type="button" className={styles.addBtn} onClick={() => openWebcam("adultIdFront", idx)}>
          Capture Front
        </button>
        {guest.idImageFront && <img src={guest.idImageFront} alt="Adult ID Front" className={styles.photoPreviewCompact} />}
        {errors[`adult_idImageFront_${idx}`] && <span className={styles.error}>{errors[`adult_idImageFront_${idx}`]}</span>}
      </div>
      <div className={styles.livePhotoContainer}>
        <label>ID Back *</label>
        <button type="button" className={styles.addBtn} onClick={() => openWebcam("adultIdBack", idx)}>
          Capture Back
        </button>
        {guest.idImageBack && <img src={guest.idImageBack} alt="Adult ID Back" className={styles.photoPreviewCompact} />}
        {errors[`adult_idImageBack_${idx}`] && <span className={styles.error}>{errors[`adult_idImageBack_${idx}`]}</span>}
      </div>

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
          <span className={styles.error}>
            {errors[`adult_livePhoto_${idx}`]}
          </span>
        )}
      </div>
    </div>
  ))}
  <button
    type="button"
    className={styles.addBtn}
    onClick={addOtherAdult}
  >
    + Add Adult
  </button>
</fieldset>
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
          
          {/* MODIFICATION B: Part 2 - Replaced file upload with webcam buttons for Children */}
          {/* REMOVED the existing "Upload ID Image" label and input */}
          {/* ADDED these two blocks instead */}
          <div className={styles.livePhotoContainer}>
            <label>ID Front *</label>
            <button type="button" className={styles.addBtn} onClick={() => openWebcam("childIdFront", idx)}>
              Capture Front
            </button>
            {child.idImageFront && <img src={child.idImageFront} alt="Child ID Front" className={styles.photoPreviewCompact} />}
            {errors[`child_idImageFront_${idx}`] && <span className={styles.error}>{errors[`child_idImageFront_${idx}`]}</span>}
          </div>
          <div className={styles.livePhotoContainer}>
            <label>ID Back *</label>
            <button type="button" className={styles.addBtn} onClick={() => openWebcam("childIdBack", idx)}>
              Capture Back
            </button>
            {child.idImageBack && <img src={child.idImageBack} alt="Child ID Back" className={styles.photoPreviewCompact} />}
            {errors[`child_idImageBack_${idx}`] && <span className={styles.error}>{errors[`child_idImageBack_${idx}`]}</span>}
          </div>
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
          <span className={styles.error}>
            {errors[`child_livePhoto_${idx}`]}
          </span>
        )}
      </div>
    </div>
  ))}
  <button
    type="button"
    className={styles.addBtn}
    onClick={addChild}
  >
    + Add Child
  </button>
</fieldset>
<button type="submit" className={styles.submitBtn}>
  Register Guest
</button>
        {/* ... */}
      </form>
    </>
  );
}