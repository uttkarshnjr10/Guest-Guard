// src/features/hotel/useReports.js
import { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

export const useReports = () => {
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 86400000 * 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [loading, setLoading] = useState(false);
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };
  const downloadCsvReport = async () => {
    setLoading(true);
    const toastId = toast.loading('Generating CSV report...');
    try {
      const response = await apiClient.get('/guests/report', {
        params: {
            startDate: dateRange.start,
            endDate: dateRange.end,
        },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `GuestReport_${dateRange.start}_to_${dateRange.end}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (error) {
       let errorMessage = 'Failed to generate report.';
       if (error.response) {
            try {
                const errorJson = JSON.parse(await error.response.data.text());
                errorMessage = errorJson.message || errorMessage;
            } catch (parseError) {
                 errorMessage = error.response?.statusText || errorMessage;
            }
       }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };
  return { dateRange, loading, handleDateChange, downloadCsvReport };
};