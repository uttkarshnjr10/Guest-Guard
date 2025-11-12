import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const [form, setForm] = useState({
    hotel: '',
    city: '',
    state: '',
    purposeOfVisit: '',
    dateFrom: '',
    dateTo: '',
  });
  const [hotels, setHotels] = useState([]); // For the dropdown
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [flaggingGuest, setFlaggingGuest] = useState(null);

  // Fetch hotels for the dropdown
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data } = await apiClient.get('/police/hotel-list');
        setHotels(data.data.map(h => ({ value: h._id, label: `${h.hotelName} (${h.city})` })));
      } catch (error) {
        toast.error('Could not load hotel list.');
      }
    };
    fetchHotels();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (selectedOption) => {
     setForm(prev => ({ ...prev, hotel: selectedOption ? selectedOption.value : '' }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setResults([]);
    try {
      const { data } = await apiClient.post('/police/analytics-search', form);
      setResults(data.data || []);
      if (data.data.length === 0) {
        toast.success('No results found for this query.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  // Copied from useSearchGuest hook for consistency
  const handleFlagSubmit = async (reason) => {
    const toastId = toast.loading('Submitting alert...');
    try {
      const payload = { guestId: flaggingGuest._id, reason };
      await apiClient.post('/police/alerts', payload);
      toast.success(`Guest "${flaggingGuest.primaryGuest.name}" has been flagged.`, { id: toastId });
      setFlaggingGuest(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit alert.', { id: toastId });
    }
  };

  return { form, hotels, results, loading, searched, flaggingGuest, setFlaggingGuest, handleFormChange, handleSelectChange, handleSearch, handleFlagSubmit };
};