// src/features/hotel/useReports.js
import { useState } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

export const useReports = () => {
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 86400000 * 30), 'yyyy-MM-dd'), // Default to last 30 days
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const generateReport = () => {
    setLoading(true);
    // Simulate API call to fetch data for the selected date range
    setTimeout(() => {
      setReportData({
        totalRegistrations: 152,
        totalAdults: 280,
        totalChildren: 45,
        guestList: [ // Sample data for the PDF table
          { name: 'Anjali Verma', checkIn: '2025-10-17', room: '101' },
          { name: 'Vikram Singh', checkIn: '2025-10-16', room: '204' },
        ]
      });
      setLoading(false);
      toast.success('Report generated successfully!');
    }, 1500);
  };

  const downloadPdf = () => {
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

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Guest Name', 'Check-In Date', 'Room No.']],
        body: reportData.guestList.map(g => [g.name, g.checkIn, g.room]),
    });

    doc.save(`Guest_Report_${dateRange.start}_to_${dateRange.end}.pdf`);
  };

  return { dateRange, reportData, loading, handleDateChange, generateReport, downloadPdf };
};