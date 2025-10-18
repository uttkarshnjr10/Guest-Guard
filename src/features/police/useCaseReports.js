// src/features/police/useCaseReports.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useCaseReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all existing case reports
      const { data } = await apiClient.get('/police/reports');
      setReports(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch case reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const openModalToCreate = () => {
    setIsModalOpen(true);
  };

  const handleCreateReport = async (newReportData) => {
    const toastId = toast.loading('Filing new case report...');
    try {
      // Create a new case report
      await apiClient.post('/police/reports', newReportData);
      toast.success('Case report filed successfully!', { id: toastId });
      setIsModalOpen(false);
      fetchReports(); // Refresh the list of reports
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to file report.', { id: toastId });
    }
  };

  return { reports, loading, isModalOpen, setIsModalOpen, openModalToCreate, handleCreateReport };
};
