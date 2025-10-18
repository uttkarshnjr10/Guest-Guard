// src/pages/admin/ManageHotelsPage.jsx
import { useState } from 'react'; // Import useState
import { AnimatePresence } from 'framer-motion'; // Import for animations
import { useFetchData } from '../../hooks/useFetchData';
import UserProfileModal from '../../components/ui/UserProfileModal'; // Import modal
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const StatusPill = ({ status }) => {
  const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Suspended: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ManageHotelsPage = () => {
  const { data: hotels, loading, error } = useFetchData('/users/admin/hotels');
  const [selectedHotel, setSelectedHotel] = useState(null); // State for the modal

  const handleView = (hotelId) => console.log(`View hotel ${hotelId}`);
  const handleApprove = (hotelId) => console.log(`Approve hotel ${hotelId}`);
  const handleSuspend = (hotelId) => console.log(`Suspend hotel ${hotelId}`);

  const columns = [
    { Header: 'Hotel Name', accessor: 'name' },
    { Header: 'City', accessor: 'city' },
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
          <Button onClick={() => handleView(row.id)} variant="secondary" className="text-sm py-1 px-2">View</Button>
          {row.status === 'Pending' && <Button onClick={() => handleApprove(row.id)} className="text-sm py-1 px-2">Approve</Button>}
          {row.status === 'Approved' && <Button onClick={() => handleSuspend(row.id)} variant="danger" className="text-sm py-1 px-2">Suspend</Button>}
        </div>
      ),
    },
  ];

  // We render the table manually to add the onClick handler
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
    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {hotels.map((row) => (
          <tr
            key={row.id}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedHotel(row)}
          >
            {columns.map((col) => (
              <td
                key={col.accessor}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                onClick={(e) => { if (col.accessor === 'actions') e.stopPropagation(); }}
              >
                {col.Cell ? col.Cell(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  if (error) return <p className="text-red-600 font-semibold">{error}</p>;

  return (
    <>
      <AnimatePresence>
        {selectedHotel && <UserProfileModal user={selectedHotel} onClose={() => setSelectedHotel(null)} />}
      </AnimatePresence>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Hotels</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessor}
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