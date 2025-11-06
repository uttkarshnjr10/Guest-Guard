// src/pages/hotel/ReportsPage.jsx
import { useReports } from '../../features/hotel/useReports';
import Button from '../../components/ui/Button';
import { FaCalendarAlt, FaFileCsv } from 'react-icons/fa';

const ReportsPage = () => {
  const { dateRange, loading, handleDateChange, downloadCsvReport } = useReports();
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Generate Guest Reports</h1>
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
          <Button onClick={downloadCsvReport} disabled={loading} className="w-full sm:w-auto flex items-center gap-2">
             <FaFileCsv /> {loading ? 'Generating...' : 'Download CSV Report'}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;