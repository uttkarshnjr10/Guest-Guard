// src/pages/admin/ManageHotelsPage.jsx
import { AnimatePresence } from 'framer-motion';
import useManageHotels from '../../features/admin/useManageHotels'; // Import the new hook
import UserProfileModal from '../../components/ui/UserProfileModal';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input'; // Import Input for search/filter

// StatusPill component remains the same
const StatusPill = ({ status }) => {
  const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    Active: 'bg-green-100 text-green-800', // Changed 'Approved' to 'Active' for consistency
    Pending: 'bg-yellow-100 text-yellow-800',
    Suspended: 'bg-red-100 text-red-800',
  };
  // Default style for statuses like 'Rejected' or null
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status || 'N/A'}</span>;
};


const ManageHotelsPage = () => {
  // Use the new hook
  const {
    hotels,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleAction,
    selectedHotel,
    setSelectedHotel,
  } = useManageHotels();

  // Define columns including the new actions
  const columns = [
    {
      Header: 'Hotel Name',
      accessor: 'hotelName',
      Cell: (row) => row.hotelName || row.username || 'N/A'
    },
    {
      Header: 'City',
      accessor: 'city',
      Cell: (row) => row.city || 'N/A'
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: (row) => <StatusPill status={row.status} />,
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: (row) => (
        <div className="flex space-x-2">
          {/* View button opens the modal */}
          <Button
            onClick={(e) => { e.stopPropagation(); setSelectedHotel(row); }}
            variant="secondary"
            className="text-sm py-1 px-2"
          >
            View
          </Button>

          {/* Conditional Action Buttons */}
          {row.status === 'Pending' && (
            <Button
              onClick={(e) => { e.stopPropagation(); handleAction('Approve', row._id, row.hotelName || row.username); }}
              className="text-sm py-1 px-2 bg-green-500 hover:bg-green-600" // Green for Approve
            >
              Approve
            </Button>
          )}
          {row.status === 'Active' && ( // Changed from 'Approved'
            <Button
              onClick={(e) => { e.stopPropagation(); handleAction('Suspend', row._id, row.hotelName || row.username); }}
              variant="secondary" // Or maybe a warning color
              className="text-sm py-1 px-2"
            >
              Suspend
            </Button>
          )}
          {row.status === 'Suspended' && (
            <Button
              onClick={(e) => { e.stopPropagation(); handleAction('Activate', row._id, row.hotelName || row.username); }}
              variant="primary" // Or green
              className="text-sm py-1 px-2"
            >
              Activate
            </Button>
          )}
         
          <Button
            onClick={(e) => { e.stopPropagation(); handleAction('Delete', row._id, row.hotelName || row.username); }}
            variant="danger"
            className="text-sm py-1 px-2"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const renderTableBody = () => {
    if (loading) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {columns.map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      );
    }
    if (hotels.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={columns.length} className="text-center py-10 text-gray-500">
                        No hotels found matching your criteria.
                    </td>
                </tr>
            </tbody>
        );
    }
    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {hotels.map((hotel) => (
          <tr
            key={hotel._id} // Use unique ID
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedHotel(hotel)} // Set selected hotel for modal
          >
            {columns.map((col) => (
              <td
                key={col.accessor || col.Header} // Use Header as fallback key for 'actions'
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                onClick={(e) => { if (col.Header === 'Actions') e.stopPropagation(); }}
              >
              
                 {col.Cell ? col.Cell(hotel) : hotel[col.accessor] || 'N/A'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };


  return (
    <>
      <AnimatePresence>
        {selectedHotel && <UserProfileModal user={selectedHotel} onClose={() => setSelectedHotel(null)} />}
      </AnimatePresence>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Hotels</h1>

        {/* Search and Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
            
          </select>
        </div>

        {/* Table Structure */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessor || col.Header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.Header}
                  </th>
                ))}
              </tr>
            </thead>
            {renderTableBody()}
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageHotelsPage;