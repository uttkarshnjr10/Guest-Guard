import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to format text
const addSection = (doc, title, y) => {
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, 14, y);
  return y + 8; // Return new Y position
};

// Main export function
export const generateGuestHistoryPDF = (history) => {
  if (!history) return;

  const { primaryGuest, stayHistory, alerts, remarks } = history;
  const doc = new jsPDF();

  // 1. Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Confidential Guest Report', 105, 15, { align: 'center' });

  // 2. Primary Guest Details
  let y = 25;
  y = addSection(doc, `Primary Guest: ${primaryGuest.primaryGuest.name}`, y);
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`ID: ${primaryGuest.idType} - ${primaryGuest.idNumber}`, 14, y);
  doc.text(`Phone: ${primaryGuest.primaryGuest.phone}`, 80, y);
  y += 6;
  doc.text(`Address: ${primaryGuest.primaryGuest.address.city}, ${primaryGuest.primaryGuest.address.state}`, 14, y);
  y += 10;

  // 3. Stay History Table
  y = addSection(doc, 'Stay History', y);
  autoTable(doc, {
    startY: y,
    head: [['Date', 'Hotel', 'Room', 'Status']],
    body: stayHistory.map(stay => [
      new Date(stay.stayDetails.checkIn).toLocaleDateString(),
      stay.hotel.hotelName || stay.hotel.username,
      stay.stayDetails.roomNumber,
      stay.status
    ]),
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 10; // Get Y position after table

  // 4. Alerts Table
  y = addSection(doc, 'Alerts on Record', y);
  autoTable(doc, {
    startY: y,
    head: [['Date', 'Reason', 'Status', 'Flagged By']],
    body: alerts.map(alert => [
      new Date(alert.createdAt).toLocaleDateString(),
      alert.reason,
      alert.status,
      alert.createdBy.username
    ]),
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 10;

  // 5. Remarks Table
  y = addSection(doc, 'Officer Remarks', y);
  autoTable(doc, {
    startY: y,
    head: [['Date', 'Remark', 'Officer']],
    body: remarks.map(remark => [
      new Date(remark.createdAt).toLocaleDateString(),
      remark.text,
      remark.officer.username
    ]),
    theme: 'grid',
  });

  // 6. Save the file
  doc.save(`GuestReport_${primaryGuest.primaryGuest.name.replace(' ', '_')}.pdf`);
};