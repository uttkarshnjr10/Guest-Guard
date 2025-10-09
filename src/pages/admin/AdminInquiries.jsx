// pages/AdminInquiries.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient'; // Make sure path is correct
import styles from './AdminInquiries.module.css';

export default function AdminInquiries() {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const { data } = await apiClient.get('/inquiries/pending');
                setInquiries(data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch inquiries.');
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    const handleApprove = (id) => {
        const inquiryToApprove = inquiries.find(inq => inq._id === id);
        if (inquiryToApprove) {
            // Navigate to your existing registration page and pass the data in the state
            navigate('/regional-admin/register', { state: { inquiryData: inquiryToApprove } });
        }
    };

    const handleReject = async (id) => {
        // Add a confirmation step to prevent accidents
        if (window.confirm('Are you sure you want to reject this inquiry?')) {
            try {
                await apiClient.post(`/inquiries/${id}/reject`);
                // Remove the inquiry from the list in the UI without a page refresh
                setInquiries(prevInquiries => prevInquiries.filter(inq => inq._id !== id));
            } catch {
                alert('Failed to reject the inquiry. Please try again.');
            }
        }
    };

    if (loading) return <div className={styles.centered}>Loading inquiries...</div>;
    if (error) return <div className={`${styles.centered} ${styles.error}`}>{error}</div>;

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Pending Hotel Registrations</h1>
            {inquiries.length === 0 ? (
                <p className={styles.centered}>No pending inquiries found.</p>
            ) : (
                <div className={styles.inquiriesGrid}>
                    {Array.isArray(inquiries) && inquiries.map((inquiry) => (
                        <div key={inquiry._id} className={styles.inquiryCard}>
                            <h3>{inquiry.hotelName}</h3>
                            <div className={styles.cardSection}>
                                <strong>Owner:</strong> {inquiry.ownerName}
                            </div>
                            <div className={styles.cardSection}>
                                <strong>Contact:</strong> {inquiry.email} | {inquiry.mobileNumber}
                            </div>
                             <div className={styles.cardSection}>
                                <strong>GST:</strong> {inquiry.gstNumber}
                            </div>
                            <div className={styles.cardSection}>
                                <strong>Address:</strong> {inquiry.fullAddress}, {inquiry.district}, {inquiry.state} - {inquiry.pinCode}
                            </div>
                            <div className={styles.documents}>
                                <a href={inquiry.ownerSignature.url} target="_blank" rel="noopener noreferrer">View Signature</a>
                                <a href={inquiry.hotelStamp.url} target="_blank" rel="noopener noreferrer">View Stamp</a>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={() => handleApprove(inquiry._id)} className={styles.approveBtn}>Approve</button>
                                <button onClick={() => handleReject(inquiry._id)} className={styles.rejectBtn}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}