// src/pages/admin/AccessLogsPage.jsx
import { useAccessLogs } from '../../features/admin/useAccessLogs';
import Input from '../../components/ui/Input';
import { FaUser, FaBuilding, FaUserShield, FaInfoCircle } from 'react-icons/fa';

const RolePill = ({ role }) => {
  const roleStyles = {
    'Hotel': 'bg-blue-100 text-blue-800',
    'Police': 'bg-green-100 text-green-800',
    'Regional Admin': 'bg-purple-100 text-purple-800',
  };
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${roleStyles[role]}`}>{role}</span>;
};

const LogItem = ({ log }) => (
  <div className="flex items-start space-x-4 p-3 border-b last:border-b-0">
    <div className="flex-shrink-0 mt-1">
      {log.user?.role === 'Hotel' && <FaBuilding className="text-blue-500" />}
      {log.user?.role === 'Police' && <FaUserShield className="text-green-500" />}
      {log.user?.role === 'Regional Admin' && <FaUser className="text-purple-500" />}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-800">
        {log.user?.username || 'System'} <span className="text-gray-500 font-normal">performed action</span> {log.action}
      </p>
      <p className="text-xs text-gray-500">
        {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        {log.searchQuery && <span className="ml-2 italic"> - Searched for: "{log.searchQuery}"</span>}
        {log.reason && <span className="ml-2 italic"> - Reason: "{log.reason}"</span>}
      </p>
    </div>
    <RolePill role={log.user?.role || 'System'} />
  </div>
);

const AccessLogsPage = () => {
  const { groupedLogs, loading, searchTerm, setSearchTerm } = useAccessLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Access Logs</h1>
        <Input
          type="text"
          placeholder="Search by user or action..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-2" />
            <p className="text-gray-500">No access logs found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([day, logs]) => (
            <div key={day} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">{day}</h2>
              <div>
                {logs.map(log => <LogItem key={log._id} log={log} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessLogsPage;