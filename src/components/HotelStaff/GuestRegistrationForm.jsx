import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import styles from "./GuestRegistrationForm.module.css";
import { toast } from "react-hot-toast";
import { differenceInYears, parseISO, format } from "date-fns";
import apiClient from "../../api/apiClient";
import { countries } from '../../data/countries';
import { nationalities } from '../../data/nationalities';
import { phoneCodes } from '../../data/phoneCodes';

// Helper Function: Converts a dataURL (from webcam) to a File object
function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Component to display AI verification status
/*
const VerificationStatus = ({ status }) => {
  if (!status.state) return null;

  if (status.state === "verifying") {
    return <div className={styles.statusVerifying}>🔎 Verifying ID...</div>;
  }
  if (status.state === "success") {
    return <div className={styles.statusSuccess}>✅ {status.message}</div>;
  }
  if (status.state === "failed") {
    return <div className={styles.statusFailed}>⚠️ {status.message}</div>;
  }
  return null;
};
*/

// Webcam Modal for capturing photos
const WebcamModal = ({ onCapture, onCancel, videoConstraints }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const capture = useCallback(() => {
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;
    if (webcam && canvas) {
      const video = webcam.video;
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Get the image data from the canvas
      const imageSrc = canvas.toDataURL("image/jpeg");
      onCapture(imageSrc);
    }
  }, [onCapture]);

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
        <canvas ref={canvasRef} style={{ display: "none" }} />
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
  // Initial state setup
  const initialGuests = { adults: [], children: [] };
  const getInitialFormState = () => ({
    name: "",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: {
              street: '',
              city: '',
              state: '',
        //    district:'',
              zipCode: '',
              country: ''
            },
    nationality: '',
    purpose: "",
    checkIn: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    expectedCheckout: "",
    roomNumber: "",
    idType: "",
    idNumber: "",
    idImageFront: null,
    idImageBack: null,
    livePhoto: null,
    guests: initialGuests,
    registrationTimestamp: new Date(),
  });

  // State declarations
  const [form, setForm] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [captureFor, setCaptureFor] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [guestNameSuggestions, setGuestNameSuggestions] = useState([]); // New state for guest name autocomplete suggestions 
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  useEffect(() => {
  // If the city input is empty or has less than 2 chars, clear suggestions
  if (form.address.city.length < 2) {
    setCitySuggestions([]);
    return;
  }

  // Set up a timer to wait 300ms after the user stops typing
  const debounceTimer = setTimeout(() => {
    const fetchCities = async () => {
      try {
        const response = await apiClient.get('/autocomplete', {
          params: {
            field: 'city',
            query: form.address.city,
          },
        });
        setCitySuggestions(response.data);
      } catch (error) {
        console.error('Failed to fetch city suggestions:', error);
        setCitySuggestions([]); // Clear suggestions on error
      }
    };

    fetchCities();
  }, 300);

  // This is a cleanup function that runs before the next effect
  // It cancels the previous timer, so we only make one API call
  return () => clearTimeout(debounceTimer);

}, [form.address.city]); // This effect re-runs whenever the city value changes
  
useEffect(() => {
  if (form.name.length < 3) {
    setGuestNameSuggestions([]);
    return;
  }

  const debounceTimer = setTimeout(() => {
    const fetchGuests = async () => {
      try {
        const response = await apiClient.get('/autocomplete', {
          params: {
            field: 'guestName',
            query: form.name,
          },
        });
        setGuestNameSuggestions(response.data);
      } catch (error) {
        console.error('Failed to fetch guest suggestions:', error);
        setGuestNameSuggestions([]);
      }
    };

    fetchGuests();
  }, 500); // A slightly longer delay is good for name searches

  return () => clearTimeout(debounceTimer);
}, [form.name]);

// ... inside the GuestRegistrationForm component

const handleEmailChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));

  if (value.includes('@')) {
    const afterAt = value.split('@')[1];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const suggestions = domains
      .filter((domain) => domain.startsWith(afterAt))
      .map((domain) => value.split('@')[0] + '@' + domain);
    setEmailSuggestions(suggestions);
  } else {
    setEmailSuggestions([]);
  }
};

  // Webcam Handlers
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
    } else if (type === "idFront") {
      // setVerification({ state: null, message: "" });
      setForm((prev) => ({ ...prev, idImageFront: imageSrc }));
      setErrors((prev) => ({ ...prev, idImageFront: null }));
    } else if (type === "idBack") {
      setForm((prev) => ({ ...prev, idImageBack: imageSrc }));
      setErrors((prev) => ({ ...prev, idImageBack: null }));
    } else if (type === "adultIdFront") {
      handleOtherAdultChange(index, "idImageFront", imageSrc);
    } else if (type === "adultIdBack") {
      handleOtherAdultChange(index, "idImageBack", imageSrc);
    } else if (type === "childIdFront") {
      handleChildChange(index, "idImageFront", imageSrc);
    } else if (type === "childIdBack") {
      handleChildChange(index, "idImageBack", imageSrc);
    } else if (type === "adultLivePhoto") {
      handleOtherAdultChange(index, "livePhoto", imageSrc);
    } else if (type === "childLivePhoto") {
      handleChildChange(index, "livePhoto", imageSrc);
    }

    setIsWebcamOpen(false);
    setCaptureFor(null);
  };

  

const handleChange = (e) => {
  const { name, value } = e.target;
  
  

  // If the input name contains a dot (like "address.pincode")
  if (name.includes('.')) {
    const [parentKey, childKey] = name.split('.'); // Splits "address.pincode" into "address" and "pincode"
    
    setForm(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));

  } else {
    // This handles all other inputs (name, email, checkIn, etc.)
    let updatedValue = { [name]: value };

    // If the check-in date is changed, validate and clear the checkout date if needed
    if (name === 'checkIn' && form.expectedCheckout && new Date(value) > new Date(form.expectedCheckout)) {
      updatedValue.expectedCheckout = '';
    }
    
    setForm(prev => ({
      ...prev,
      ...updatedValue
    }));
  }

  
 

  // Reset error for this field
  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: null }));
  }
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

  const addOtherAdult = () =>
    setForm((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        adults: [
          ...prev.guests.adults,
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
const handleSelectGuest = (guest) => {
  // Format the date of birth correctly for the input field (YYYY-MM-DD)
  const formattedDob = guest.dob ? new Date(guest.dob).toISOString().split('T')[0] : '';

  // Update the form state with the selected guest's data
  setForm(prev => ({
    ...prev,
    name: guest.name || '',
    dob: formattedDob,
    gender: guest.gender || '',
    phone: guest.phone || '',
    email: guest.email || '',
    nationality: guest.nationality || '', 
    address: {
      street: guest.address?.street || '',
      city: guest.address?.city || '',
      state: guest.address?.state || '',
    //  pincode: guest.address?.pincode || '', 
      zipCode: guest.address?.zipCode || '',
      country: guest.address?.country || '',
    }
  }));

  // Clear the suggestions list
  setGuestNameSuggestions([]);
};
  // Validation
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.dob) errs.dob = "DOB is required";
    if (!form.gender) errs.gender = "Gender is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.email.trim()) errs.email = "Email is required";

      ['state', 'city', 'zipCode', 'country'].forEach((field) => {
    if (!form.address[field] || !form.address[field].trim()) {
      // Create a more user-friendly field name for the error message
      const fieldName = field === 'zipCode' ? 'Zip Code' : field.charAt(0).toUpperCase() + field.slice(1);
      errs[`address.${field}`] = `${fieldName} is required`;
    }
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
      if (!g.idImageFront) errs[`adult_idImageFront_${idx}`] = "ID front is required";
      if (!g.idImageBack) errs[`adult_idImageBack_${idx}`] = "ID back is required";
      if (!g.livePhoto) errs[`adult_livePhoto_${idx}`] = "Live photo is required";
    });

    form.guests.children.forEach((c, idx) => {
      if (!c.name || !c.name.trim()) errs[`child_name_${idx}`] = "Name required";
      if (!c.dob) errs[`child_dob_${idx}`] = "DOB is required";
      if (c.age >= 10) {
        if (!c.idType) errs[`child_idType_${idx}`] = "ID proof type is required";
        if (!c.idImageFront) errs[`child_idImageFront_${idx}`] = "ID front is required";
        if (!c.idImageBack) errs[`child_idImageBack_${idx}`] = "ID back is required";
      }
      if (!c.livePhoto) errs[`child_livePhoto_${idx}`] = "Live photo is required";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };



const parseOcrData = (text) => {
  const data = {};
  
  // Rule for Date of Birth (DD/MM/YYYY format)
  const dobRegex = /(\d{2}\/\d{2}\/\d{4})/;
  const dobMatch = text.match(dobRegex);
  if (dobMatch) {
    // Convert DD/MM/YYYY to YYYY-MM-DD for the form input
    const [day, month, year] = dobMatch[0].split('/');
    data.dob = `${year}-${month}-${day}`;
  }

  // Rule for Name
  
  const lines = text.split('\n');
  // A simple heuristic: find a line with 2-3 words that's all letters and spaces
  const nameRegex = /^[A-Za-z\s]{2,50}$/; 
  let potentialName = lines.find(line => line.split(' ').length >= 2 && line.split(' ').length <= 4 && nameRegex.test(line.trim()));
  if(potentialName) data.name = potentialName.trim();


  // Rule for Aadhaar Number (12 digits, possibly with spaces)
  const aadhaarRegex = /(\d{4}\s?\d{4}\s?\d{4})/;
  const aadhaarMatch = text.match(aadhaarRegex);
  if (aadhaarMatch) {
    data.idType = 'Aadhaar';
    data.idNumber = aadhaarMatch[0].replace(/\s/g, ''); // Remove spaces
  }

  // Rule for Gender
  if (text.includes('Male') || text.includes('MALE')) {
    data.gender = 'Male';
  } else if (text.includes('Female') || text.includes('FEMALE')) {
    data.gender = 'Female';
  }
  
  return data;
};

//OcrScan Handler

const handleOcrScan = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setIsScanning(true);
  const toastId = toast.loading('Scanning ID card, please wait...');

  const formDataToSend = new FormData();
  formDataToSend.append('idImage', file);

  try {
    // 1. Call the backend to get the raw text
    const response = await apiClient.post('/ocr/scan', formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const rawText = response.data.text;
    
    // 2. Parse the text to find the data
    const extractedData = parseOcrData(rawText);
    
    // 3. Update the form state with the extracted data
    setForm(prev => ({
        ...prev,
        name: extractedData.name || prev.name,
        dob: extractedData.dob || prev.dob,
        gender: extractedData.gender || prev.gender,
        idType: extractedData.idType || prev.idType,
        idNumber: extractedData.idNumber || prev.idNumber,
    }));

    // 4. Automatically place the scanned image into the ID Front preview
    const reader = new FileReader();
    reader.onloadend = () => {
        setForm(prev => ({ ...prev, idImageFront: reader.result }));
    };
    reader.readAsDataURL(file);

    toast.success('Scan complete! Please verify the details.', { id: toastId });

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to scan ID card.';
    toast.error(errorMessage, { id: toastId });
  } finally {
    setIsScanning(false);
    // Reset the file input so the user can scan another ID if needed
    event.target.value = null; 
  }
};

  // Handle Form Submission
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) {
    toast.error("Please fill all required fields correctly.");
    return;
  }

  const toastId = toast.loading("Registering guest...");

  const formDataToSend = new FormData();
  try {
    // --- Primary Guest Details ---
    formDataToSend.append("primaryGuestName", form.name);
    formDataToSend.append("primaryGuestDob", form.dob);
    formDataToSend.append("primaryGuestGender", form.gender);
    formDataToSend.append("primaryGuestPhone", form.phone);
    formDataToSend.append("primaryGuestEmail", form.email);

    //  Address 
    formDataToSend.append("primaryGuestAddressStreet", form.address.street || "");
    formDataToSend.append("primaryGuestAddressCity", form.address.city || "");
    formDataToSend.append("primaryGuestAddressState", form.address.state || "");
  //  formDataToSend.append("primaryGuestAddressZipCode", form.address.pincode || "");
    formDataToSend.append("primaryGuestAddressZipCode", form.address.zipCode || "");
    formDataToSend.append("primaryGuestAddressCountry", form.address.country || "");

    //  Nationality
    formDataToSend.append("primaryGuestNationality", form.nationality || "");

    //  ID Details 
    formDataToSend.append("idType", form.idType);
    formDataToSend.append("idNumber", form.idNumber);

    if (form.idImageFront)
      formDataToSend.append("idImageFront", dataURLtoFile(form.idImageFront, "idImageFront.jpg"));
    if (form.idImageBack)
      formDataToSend.append("idImageBack", dataURLtoFile(form.idImageBack, "idImageBack.jpg"));
    if (form.livePhoto)
      formDataToSend.append("livePhoto", dataURLtoFile(form.livePhoto, "livePhoto.jpg"));

    // --- Stay Details ---
    formDataToSend.append("purposeOfVisit", form.purpose);
    formDataToSend.append("checkIn", form.checkIn);
    formDataToSend.append("expectedCheckout", form.expectedCheckout);
    formDataToSend.append("roomNumber", form.roomNumber);

    // --- Accompanying Guests (JSON string) ---
    formDataToSend.append("accompanyingGuests", JSON.stringify(form.guests));

    // --- Accompanying Guest Files ---
    form.guests.adults.forEach((adult, index) => {
      if (adult.idImageFront)
        formDataToSend.append(
          `adult_${index}_idImageFront`,
          dataURLtoFile(adult.idImageFront, `adult_${index}_idFront.jpg`)
        );
      if (adult.idImageBack)
        formDataToSend.append(
          `adult_${index}_idImageBack`,
          dataURLtoFile(adult.idImageBack, `adult_${index}_idBack.jpg`)
        );
      if (adult.livePhoto)
        formDataToSend.append(
          `adult_${index}_livePhoto`,
          dataURLtoFile(adult.livePhoto, `adult_${index}_livePhoto.jpg`)
        );
    });

    form.guests.children.forEach((child, index) => {
      if (child.idImageFront)
        formDataToSend.append(
          `child_${index}_idImageFront`,
          dataURLtoFile(child.idImageFront, `child_${index}_idFront.jpg`)
        );
      if (child.idImageBack)
        formDataToSend.append(
          `child_${index}_idImageBack`,
          dataURLtoFile(child.idImageBack, `child_${index}_idBack.jpg`)
        );
      if (child.livePhoto)
        formDataToSend.append(
          `child_${index}_livePhoto`,
          dataURLtoFile(child.livePhoto, `child_${index}_livePhoto.jpg`)
        );
    });
  } catch (dataError) {
    toast.error("Error preparing registration data.", { id: toastId });
    console.error("Error creating FormData:", dataError);
    return;
  }

  // --- API Call ---
  try {
    const response = await apiClient.post("/guests/register", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Guest registered successfully!", { id: toastId });

    try {
      onAddGuest && onAddGuest();
      setForm(getInitialFormState());
      setErrors({});
    } catch (postSuccessError) {
      console.error("Error in post-registration cleanup:", postSuccessError);
    }
  } catch (apiError) {
    const errorMessage = apiError.response?.data?.message || "Failed to register guest.";
    toast.error(errorMessage, { id: toastId });
    console.error("Guest registration failed:", apiError);
  }
};


  // Camera facing mode logic
  const getCameraFacingMode = () => {
    if (captureFor?.type.includes("id")) {
      return "environment";
    }
    return "user";
  };

  const minCheckInDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  // Render
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
        {/* Main Guest Details */}
        <fieldset>
          <legend>Main Guest Details
             <label htmlFor="ocr-file-input" className={styles.scanButton} title="Scan ID Card with AI">
         Scan ID
         </label>
          </legend>
          <input 
      type="file" 
      id="ocr-file-input"
      style={{ display: 'none' }} 
      onChange={handleOcrScan}
      accept="image/*"
      disabled={isScanning}
  />
          <div className={styles.row}>
            {/* Add a wrapper div to contain the input and the suggestions */}
<div className={styles.autocompleteWrapper}>
  <label>
    Full Name *
    <input
      type="text"
      name="name"
      value={form.name}
      onChange={handleChange}
      autoComplete="off"
    />
    {errors.name && <span className={styles.error}>{errors.name}</span>}
  </label>

  {/* --- NEW: Custom Suggestions Dropdown --- */}
  {guestNameSuggestions.length > 0 && (
    <ul className={styles.suggestionsList}>
      {guestNameSuggestions.map((guest, index) => (
        <li
          key={index} // Using index is acceptable here as the list is temporary
          className={styles.suggestionItem}
          onClick={() => handleSelectGuest(guest)}
        >
          <span className={styles.suggestionName}>{guest.name}</span>
          <span className={styles.suggestionDetail}>{guest.phone}</span>
        </li>
      ))}
    </ul>
  )}
</div>
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
          <div className={styles.row}>
     
<label>
  Phone Number *
  <input 
    type="tel" 
    name="phone" 
    value={form.phone} 
    onChange={handleChange} 
    list="phone-codes-list" // <-- ADD THIS
  />
  {/* ADD THIS DATALIST */}
  <datalist id="phone-codes-list">
    {phoneCodes.map((code) => (
      <option key={code} value={code} />
    ))}
  </datalist>
  {errors.phone && <span className={styles.error}>{errors.phone}</span>}
</label>
<label>
  Email *
  <input 
    type="email" 
    name="email" 
    value={form.email} 
    onChange={handleEmailChange} 
    list="email-suggestions" 
  />
  {/* ADD THIS DATALIST */}
  <datalist id="email-suggestions">
    {emailSuggestions.map((suggestion) => (
      <option key={suggestion} value={suggestion} />
    ))}
  </datalist>
  {errors.email && <span className={styles.error}>{errors.email}</span>}
</label>
          </div>
        </fieldset>
{/* Address */}
<fieldset>
  <legend>Address *</legend>
  
  {/* Row 1: State, City, Zip Code */}
  <div className={styles.row}>
    <label>
      State *
      <input 
        type="text" 
        name="address.state" 
        value={form.address.state} 
        onChange={handleChange} 
      />
      {errors["address.state"] && <span className={styles.error}>{errors["address.state"]}</span>}
    </label>

    {/* The 'District' input has been removed because it does not exist in my backend model. */}

    <label>
      City *
      <input
        type="text"
        name="address.city"
        value={form.address.city}
        onChange={handleChange}
        list="city-suggestions"
        autoComplete="off"
      />
      {errors["address.city"] && <span className={styles.error}>{errors["address.city"]}</span>}
      <datalist id="city-suggestions">
        {citySuggestions.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>
    </label>

    <label>
      Zip Code * {/* MODIFIED: Label text changed */}
      <input 
        type="text" 
        name="address.zipCode"  /* MODIFIED: 'name' attribute updated */
        value={form.address.zipCode}  /* MODIFIED: 'value' updated */
        onChange={handleChange} 
      />
      {/* MODIFIED: Error key updated */}
      {errors["address.zipCode"] && <span className={styles.error}>{errors["address.zipCode"]}</span>}
    </label>
  </div>

  {/* Row 2: Country, Nationality (This part was correct and remains unchanged) */}
  <div className={styles.row}>
    <label>
      Country *
      <input
        type="text"
        name="address.country"
        value={form.address.country}
        onChange={handleChange}
        list="country-list"
      />
      <datalist id="country-list">
        {/* Make sure 'countries' is defined in your component's scope */}
        {countries.map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
      {errors["address.country"] && <span className={styles.error}>{errors["address.country"]}</span>}
    </label>

    <label>
      Nationality *
      <input
        type="text"
        name="nationality"
        value={form.nationality}
        onChange={handleChange}
        list="nationality-list"
      />
      <datalist id="nationality-list">
        {/* Make sure 'nationalities' is defined in your component's scope */}
        {nationalities.map((nationality) => (
          <option key={nationality} value={nationality} />
        ))}
      </datalist>
      {errors.nationality && <span className={styles.error}>{errors.nationality}</span>}
    </label>
  </div>
</fieldset>

        {/* Stay Details */}
        <fieldset>
          <legend>Stay Details</legend>
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
      min={minCheckInDate} // Prevents selecting a past date/time
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
      min={form.checkIn} // Prevents selecting a date/time before check-in
    />
    {errors.expectedCheckout && <span className={styles.error}>{errors.expectedCheckout}</span>}
  </label>
</div>
          <label>
            Allocated Hotel Room Number *
            <input type="text" name="roomNumber" value={form.roomNumber} onChange={handleChange} />
            {errors.roomNumber && <span className={styles.error}>{errors.roomNumber}</span>}
          </label>
        </fieldset>

        {/* ID & Photo Proof (Main Guest) */}
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
            <div className={styles.livePhotoContainer}>
              <label>ID Proof Front *</label>
              <button type="button" className={styles.addBtn} onClick={() => openWebcam("idFront")}>
                Capture
              </button>
              {form.idImageFront && (
                <img src={form.idImageFront} alt="ID Front Preview" className={styles.photoPreviewCompact} />
              )}
              {errors.idImageFront && <span className={styles.error}>{errors.idImageFront}</span>}
              {/* <VerificationStatus status={verification} /> */}
            </div>
            <div className={styles.livePhotoContainer}>
              <label>ID Proof Back *</label>
              <button type="button" className={styles.addBtn} onClick={() => openWebcam("idBack")}>
                Capture
              </button>
              {form.idImageBack && (
                <img src={form.idImageBack} alt="ID Back Preview" className={styles.photoPreviewCompact} />
              )}
              {errors.idImageBack && <span className={styles.error}>{errors.idImageBack}</span>}
            </div>
            <div className={styles.livePhotoContainer}>
              <label>Live Photo *</label>
              <button type="button" className={styles.addBtn} onClick={() => openWebcam("main")}>
                Capture
              </button>
              {form.livePhoto && (
                <img src={form.livePhoto} alt="Live Preview" className={styles.photoPreviewCompact} />
              )}
              {errors.livePhoto && <span className={styles.error}>{errors.livePhoto}</span>}
            </div>
          </div>
        </fieldset>

        {/* Other Accompanying Adults */}
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
              <div className={styles.livePhotoContainer}>
                <label>ID Front *</label>
                <button type="button" className={styles.addBtn} onClick={() => openWebcam("adultIdFront", idx)}>
                  Capture
                </button>
                {guest.idImageFront && (
                  <img src={guest.idImageFront} alt="Adult ID Front" className={styles.photoPreviewCompact} />
                )}
                {errors[`adult_idImageFront_${idx}`] && <span className={styles.error}>{errors[`adult_idImageFront_${idx}`]}</span>}
              </div>
              <div className={styles.livePhotoContainer}>
                <label>ID Back *</label>
                <button type="button" className={styles.addBtn} onClick={() => openWebcam("adultIdBack", idx)}>
                  Capture
                </button>
                {guest.idImageBack && (
                  <img src={guest.idImageBack} alt="Adult ID Back" className={styles.photoPreviewCompact} />
                )}
                {errors[`adult_idImageBack_${idx}`] && <span className={styles.error}>{errors[`adult_idImageBack_${idx}`]}</span>}
              </div>
              <div className={styles.livePhotoContainer}>
                <label>Live Photo *</label>
                <button type="button" className={styles.addBtn} onClick={() => openWebcam("adultLivePhoto", idx)}>
                  Capture
                </button>
                {guest.livePhoto && (
                  <img src={guest.livePhoto} alt="Adult Live" className={styles.photoPreviewCompact} />
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

        {/* Accompanying Children */}
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
                  <div className={styles.livePhotoContainer}>
                    <label>ID Front *</label>
                    <button type="button" className={styles.addBtn} onClick={() => openWebcam("childIdFront", idx)}>
                      Capture
                    </button>
                    {child.idImageFront && (
                      <img src={child.idImageFront} alt="Child ID Front" className={styles.photoPreviewCompact} />
                    )}
                    {errors[`child_idImageFront_${idx}`] && (
                      <span className={styles.error}>{errors[`child_idImageFront_${idx}`]}</span>
                    )}
                  </div>
                  <div className={styles.livePhotoContainer}>
                    <label>ID Back *</label>
                    <button type="button" className={styles.addBtn} onClick={() => openWebcam("childIdBack", idx)}>
                      Capture
                    </button>
                    {child.idImageBack && (
                      <img src={child.idImageBack} alt="Child ID Back" className={styles.photoPreviewCompact} />
                    )}
                    {errors[`child_idImageBack_${idx}`] && (
                      <span className={styles.error}>{errors[`child_idImageBack_${idx}`]}</span>
                    )}
                  </div>
                </>
              )}
              <div className={styles.livePhotoContainer}>
                <label>Live Photo *</label>
                <button type="button" className={styles.addBtn} onClick={() => openWebcam("childLivePhoto", idx)}>
                  Capture
                </button>
                {child.livePhoto && (
                  <img src={child.livePhoto} alt="Child Live" className={styles.photoPreviewCompact} />
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

        {/* Submit Button */}
        <button type="submit" className={styles.submitBtn}>
          Register Guest
        </button>
      </form>
    </>
  );
}