// src/features/police/useSearchGuest.js
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useSearchGuest = () => {
  const [form, setForm] = useState({ query: '', searchBy: 'name', reason: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [flaggingGuest, setFlaggingGuest] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.query.trim() || !form.reason.trim()) {
      toast.error('Search term and reason are mandatory.');
      return;
    }
    setLoading(true);
    setSearched(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setResults([
        { _id: '12345', primaryGuest: { name: 'Rohan Sharma' }, idNumber: 'XXXX XXXX 1234', hotel: { username: 'Grand Palace' }, stayDetails: { checkIn: new Date() } },
        { _id: '67890', primaryGuest: { name: 'Rohan Verma' }, idNumber: 'XXXX XXXX 5678', hotel: { username: 'Royal Stay' }, stayDetails: { checkIn: new Date(Date.now() - 86400000 * 5) } }
      ]);
      setLoading(false);
    }, 1500);
  };

  const handleFlagSubmit = (reason) => {
    toast.loading('Submitting alert...');
    // Simulate API call
    setTimeout(() => {
        toast.dismiss();
        toast.success(`Guest "${flaggingGuest.primaryGuest.name}" has been flagged.`);
        setFlaggingGuest(null);
    }, 1000);
  };

  return { form, results, loading, error, searched, flaggingGuest, setFlaggingGuest, handleFormChange, handleSearch, handleFlagSubmit };
};