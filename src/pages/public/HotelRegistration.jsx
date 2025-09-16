// pages/HotelRegistration.jsx

import React, { useState } from 'react';
import apiClient from '../../api/apiClient'; 
import styles from './HotelRegistration.module.css';

export default function HotelRegistration() {
    const [formData, setFormData] = useState({
        hotelName: '',
        gstNumber: '',
        ownerName: '',
        email: '',
        mobileNumber: '',
        nationality: 'Indian',
        state: '',
        district: '',
        postOffice: '',
        pinCode: '',
        localThana: '',
        fullAddress: '',
        pinLocation: '',
    });

    const [files, setFiles] = useState({
        ownerSignature: null,
        hotelStamp: null,
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        setFiles({ ...files, [name]: selectedFiles[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!files.ownerSignature || !files.hotelStamp) {
            setError('Please upload both signature and stamp files.');
            setLoading(false);
            return;
        }

        const submissionData = new FormData();
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }
        submissionData.append('ownerSignature', files.ownerSignature);
        submissionData.append('hotelStamp', files.hotelStamp);

        try {
            // --- THIS IS THE UPDATED SECTION ---
            const response = await apiClient.post(
                '/inquiries/hotel-registration', 
                submissionData
            );
            // ------------------------------------
            
            setMessage(response.data.message);
            // Optionally reset form here
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Register Your Hotel</h1>
                <p className={styles.subtitle}>Submit your details and our team will get in touch with you shortly.</p>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Section 1: Basic Details */}
                    <h2 className={styles.sectionTitle}>Basic Information</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="hotelName">Hotel Name</label>
                            <input type="text" id="hotelName" name="hotelName" onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="gstNumber">GST Number</label>
                            <input type="text" id="gstNumber" name="gstNumber" onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="ownerName">Owner Name</label>
                            <input type="text" id="ownerName" name="ownerName" onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Hotel / Owner Mail ID</label>
                            <input type="email" id="email" name="email" onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="mobileNumber">Hotel Mobile Number</label>
                            <input type="tel" id="mobileNumber" name="mobileNumber" onChange={handleInputChange} required />
                        </div>
                    </div>

                    {/* Section 2: Address Details */}
                    <h2 className={styles.sectionTitle}>Address Details</h2>
                    <div className={styles.formGrid}>
                         <div className={styles.formGroup}>
                            <label htmlFor="state">State</label>
                            <input type="text" id="state" name="state" onChange={handleInputChange} required />
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="district">District</label>
                            <input type="text" id="district" name="district" onChange={handleInputChange} required />
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="postOffice">Post Office</label>
                            <input type="text" id="postOffice" name="postOffice" onChange={handleInputChange} required />
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="pinCode">Pin Code</label>
                            <input type="text" id="pinCode" name="pinCode" onChange={handleInputChange} required />
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="localThana">Local Thana (Police Station)</label>
                            <input type="text" id="localThana" name="localThana" onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="fullAddress">Full Address</label>
                        <textarea id="fullAddress" name="fullAddress" rows="3" onChange={handleInputChange} required></textarea>
                    </div>
                     <div className={styles.formGroup}>
                        <label htmlFor="pinLocation">Pin Location (e.g., Google Maps Link)</label>
                        <input type="text" id="pinLocation" name="pinLocation" onChange={handleInputChange} />
                    </div>

                    {/* Section 3: Document Uploads */}
                    <h2 className={styles.sectionTitle}>Document Uploads</h2>
                     <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                           <label htmlFor="ownerSignature">Shop Owner Signature</label>
                           <input type="file" id="ownerSignature" name="ownerSignature" onChange={handleFileChange} required />
                        </div>
                        <div className={styles.formGroup}>
                           <label htmlFor="hotelStamp">Hotel Stamp / Shop Mohar</label>
                           <input type="file" id="hotelStamp" name="hotelStamp" onChange={handleFileChange} required />
                        </div>
                    </div>
                    
                    {/* Submission Feedback */}
                    {message && <div className={styles.successMessage}>{message}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}