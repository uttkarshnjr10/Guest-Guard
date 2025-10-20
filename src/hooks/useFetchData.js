import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export const useFetchData = (apiEndpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get(apiEndpoint, { signal: controller.signal });
        // This handles cases where API returns data in a `data` property or as the root object.
        setData(response.data.data || response.data || []);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.response?.data?.message || `Failed to fetch data.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel the request if the component unmounts
    return () => {
      controller.abort();
    };
  }, [apiEndpoint]);

  return { data, loading, error };
};

