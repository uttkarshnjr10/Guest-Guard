// src/components/police/NotificationPanel.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import styles from './NotificationPanel.module.css';
import { format } from 'date-fns';

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data } = await apiClient.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: you can add polling to refresh notifications periodically
        // const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
        // return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        // Optimistic UI update: mark as read instantly on the frontend
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        try {
            await apiClient.put(`/notifications/${id}/read`);
            // If API call fails, you could revert the state, but for this use-case, it's okay.
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h3>Notifications</h3>
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount} Unread</span>}
            </div>
            <div className={styles.notificationList}>
                {loading ? (
                    <p>Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <p>You have no notifications.</p>
                ) : (
                    notifications.map(n => (
                        <div key={n._id} className={`${styles.notificationItem} ${!n.isRead ? styles.unread : ''}`}>
                            <p>{n.message}</p>
                            <div className={styles.footer}>
                                <small>{format(new Date(n.createdAt), 'dd-MMM-yyyy, hh:mm a')}</small>
                                {!n.isRead && (
                                    <button onClick={() => handleMarkAsRead(n._id)} className={styles.markReadBtn}>
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}