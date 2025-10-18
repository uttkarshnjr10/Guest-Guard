// src/features/police/useCaseReports.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useCaseReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API call to fetch existing case reports
    setTimeout(() => {
      setReports([
        {
          id: 'CASE-001', title: 'Investigation into Financial Fraud', status: 'Open',
          officer: 'Officer Singh', createdAt: new Date(Date.now() - 86400000 * 2),
          summary: 'Case opened following a flag on Rohan Sharma for suspicious transactions.',
          linkedGuests: ['Rohan Sharma'],
        },
        {
          id: 'CASE-002', title: 'Missing Person Inquiry', status: 'Closed',
          officer: 'Officer Verma', createdAt: new Date(Date.now() - 86400000 * 10),
          summary: 'Inquiry regarding Priya Mehta. Subject was located and case is now closed.',
          linkedGuests: ['Priya Mehta'],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const openModalToCreate = () => {
    setSelectedReport(null);
    setIsModalOpen(true);
  };

  const handleCreateReport = (newReportData) => {
    toast.loading('Filing new case report...');
    // Simulate API call
    setTimeout(() => {
        const newReport = { ...newReportData, id: `CASE-00${reports.length + 1}`, createdAt: new Date() };
        setReports(prev => [newReport, ...prev]);
        toast.dismiss();
        toast.success('Case report filed successfully!');
        setIsModalOpen(false);
    }, 1000);
  };

  return { reports, loading, isModalOpen, setIsModalOpen, selectedReport, openModalToCreate, handleCreateReport };
};