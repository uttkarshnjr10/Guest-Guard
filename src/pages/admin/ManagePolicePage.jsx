// src/pages/admin/ManagePolicePage.jsx
import { AnimatePresence } from 'framer-motion';
import useManagePolice from '../../features/admin/useManagePolice';
import UserProfileModal from '../../components/ui/UserProfileModal';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const StatusPill = ({ status }) => {
  const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    Active: 'bg-green-100 text-green-800',
    Suspended: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ManagePolicePage = () => {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleAction,
    selectedUser,
    setSelectedUser,
  } = useManagePolice();

  const columns = [
    { Header: 'Station Name', accessor: 'name' },
    { Header: 'Jurisdiction', accessor: 'location' },
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
          <Button
            onClick={() => handleAction(row.status === 'Active' ? 'Suspend' : 'Activate', row.id)}
            variant={row.status === 'Active' ? 'secondary' : 'primary'}
            className="text-sm py-1 px-2"
          >
            {row.status === 'Active' ? 'Suspend' : 'Activate'}
          </Button>
          <Button
            onClick={() => handleAction('Delete', row.id)}
            variant="danger"
            className="text-sm py-1 px-2"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // We need to render the table manually to add the onClick to the rows
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
        {users.map((row) => (
          <tr
            key={row.id}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedUser(row)}
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

  return (
    <>
      <AnimatePresence>
        {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Police Users</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search by name or jurisdiction..."
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
            <option value="Suspended">Suspended</option>
          </select>
        </div>

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

export default ManagePolicePage;