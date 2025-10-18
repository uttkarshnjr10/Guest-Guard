// src/pages/hotel/ReportsPage.jsx
import { useReports } from '../../features/hotel/useReports';
import Button from '../../components/ui/Button';
import { FaCalendarAlt, FaFilePdf, FaUsers, FaChild } from 'react-icons/fa';

const ReportStatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="text-blue-500 mr-4">{icon}</div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
    </div>
);

const ReportsPage = () => {
  const { dateRange, reportData, loading, handleDateChange, generateReport, downloadPdf } = useReports();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Generate Guest Reports</h1>

      {/* Date Range Picker */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaCalendarAlt /> Select Date Range</h2>
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
            <input type="date" name="start" value={dateRange.start} onChange={handleDateChange} className="p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
            <input type="date" name="end" value={dateRange.end} onChange={handleDateChange} className="p-2 border border-gray-300 rounded-md" />
          </div>
          <Button onClick={generateReport} disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Report Display */}
      {reportData && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Report Summary</h2>
            <Button onClick={downloadPdf} variant="secondary" className="flex items-center gap-2 text-sm">
              <FaFilePdf /> Download as PDF
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportStatCard title="Total Registrations" value={reportData.totalRegistrations} icon={<FaUsers size={32} />} />
            <ReportStatCard title="Total Adults" value={reportData.totalAdults} icon={<FaUsers size={32} />} />
            <ReportStatCard title="Total Children" value={reportData.totalChildren} icon={<FaChild size={32} />} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;