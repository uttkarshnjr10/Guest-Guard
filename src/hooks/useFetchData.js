// src/hooks/useFetchData.js
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export const useFetchData = (apiEndpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Re-enable for real API calls
        // const response = await apiClient.get(apiEndpoint);
        // setData(response.data.data);

        // Simulate API call for now
        setTimeout(() => {
          const mockData = [
            { id: 1, name: 'Grand Palace Hotel', city: 'Indore', status: 'Approved' },
            { id: 2, name: 'Royal Stay', city: 'Bhopal', status: 'Pending' },
            { id: 3, name: 'Lakeview Inn', city: 'Udaipur', status: 'Approved' },
            { id: 4, name: 'City Center Suites', city: 'Indore', status: 'Suspended' },
          ];
          setData(mockData);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError(err.response?.data?.message || `Failed to fetch data from ${apiEndpoint}`);
        setLoading(false);
      }
    };
    fetchData();
  }, [apiEndpoint]);

  return { data, loading, error };
};