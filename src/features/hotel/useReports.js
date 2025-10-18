// src/features/hotel/useReports.js
import { useState } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

export const useReports = () => {
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 86400000 * 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const generateReport = async () => {
    setLoading(true);
    setReportData(null);
    try {
      // Fetch report data from the backend with the selected date range
      const response = await apiClient.get('/hotel/reports', {
        params: dateRange,
      });
      setReportData(response.data.data);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!reportData) return;
    const doc = new jsPDF();
    doc.text('Guest Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Period: ${dateRange.start} to ${dateRange.end}`, 14, 30);

    doc.autoTable({
        startY: 40,
        head: [['Metric', 'Value']],
        body: [
            ['Total Guest Registrations', reportData.totalRegistrations],
            ['Total Adults', reportData.totalAdults],
            ['Total Children', reportData.totalChildren],
        ],
    });

    if (reportData.guestList && reportData.guestList.length > 0) {
      doc.autoTable({
          startY: doc.lastAutoTable.finalY + 10,
          head: [['Guest Name', 'Check-In Date', 'Room No.']],
          body: reportData.guestList.map(g => [g.name, format(new Date(g.checkIn), 'yyyy-MM-dd'), g.room]),
      });
    }

    doc.save(`Guest_Report_${dateRange.start}_to_${dateRange.end}.pdf`);
  };

  return { dateRange, reportData, loading, handleDateChange, generateReport, downloadPdf };
};
