// src/pages/police/FlagsReportsPage.jsx
import { useFlagsReports } from '../../features/police/useFlagsReports';
import Button from '../../components/ui/Button';
import { FaUser, FaIdCard, FaExclamationCircle, FaRegClock, FaUserTie } from 'react-icons/fa';

const AlertCardSkeleton = () => (
    <div className="bg-white p-5 rounded-lg shadow-md animate-pulse">
        <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="flex justify-between items-center mt-6">
             <div className="h-4 bg-gray-200 rounded w-48"></div>
             <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
    </div>
);

const FlagsReportsPage = () => {
  const { filteredAlerts, loading, filter, setFilter, handleResolve } = useFlagsReports();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Flags & Alerts Management</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="font-medium text-gray-600">Show:</label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full sm:w-auto mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="Open">Open</option>
            <option value="All">All</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AlertCardSkeleton />
            <AlertCardSkeleton />
            <AlertCardSkeleton />
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No {filter === 'Open' ? 'open' : ''} alerts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAlerts.map(alert => (
            <div key={alert._id} className={`bg-white rounded-lg shadow-md border-l-4 ${alert.status === 'Open' ? 'border-yellow-400' : 'border-green-400'}`}>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${alert.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{alert.status}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><FaRegClock /> {new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 font-semibold text-gray-700"><FaUser /> {alert.guest?.primaryGuest?.name || 'N/A'}</p>
                        <p className="flex items-center gap-2 text-gray-600"><FaIdCard /> {alert.guest?.idNumber || 'N/A'}</p>
                        <p className="flex items-start gap-2 text-gray-600"><FaExclamationCircle className="mt-1 flex-shrink-0" /> {alert.reason}</p>
                    </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center text-xs text-gray-500 rounded-b-lg">
                    <p className="flex items-center gap-1"><FaUserTie /> By: {alert.createdBy?.username || 'Unknown'}</p>
                    {alert.status === 'Open' && (
                        <Button onClick={() => handleResolve(alert._id)} variant="secondary" className="text-xs py-1 px-2">Mark as Resolved</Button>
                    )}
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlagsReportsPage;