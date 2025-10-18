// src/pages/police/SearchGuestPage.jsx
import { Link } from 'react-router-dom';
import { useSearchGuest } from '../../features/police/useSearchGuest';
import FlagGuestModal from '../../features/police/FlagGuestModal';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SearchGuestPage = () => {
  const { form, results, loading, searched, flaggingGuest, setFlaggingGuest, handleFormChange, handleSearch, handleFlagSubmit } = useSearchGuest();

  const columns = [
    { Header: 'Name', accessor: 'name', Cell: (row) => row.primaryGuest.name },
    { Header: 'ID Number', accessor: 'idNumber' },
    { Header: 'Hotel', accessor: 'hotel', Cell: (row) => row.hotel.username },
    { Header: 'Check-In', accessor: 'checkIn', Cell: (row) => new Date(row.stayDetails.checkIn).toLocaleDateString() },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: (row) => (
        <div className="flex space-x-2">
          <Button onClick={() => setFlaggingGuest(row)} variant="danger" className="text-sm py-1 px-2">Flag</Button>
          <Link to={`/police/guest/${row._id}`}>
            <Button variant="secondary" className="text-sm py-1 px-2">History</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      {flaggingGuest && (
        <FlagGuestModal
          guest={flaggingGuest}
          onClose={() => setFlaggingGuest(null)}
          onSubmit={handleFlagSubmit}
        />
      )}

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Secure Guest Search</h1>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <select name="searchBy" value={form.searchBy} onChange={handleFormChange} className="w-full sm:w-auto mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="name">Name</option>
              <option value="phone">Phone</option>
              <option value="id">ID Number</option>
            </select>
            <Input type="text" name="query" placeholder={`Enter guest ${form.searchBy}...`} value={form.query} onChange={handleFormChange} className="flex-grow" autoFocus />
          </div>
          <textarea name="reason" placeholder="Reason for search (e.g., 'Active investigation case #123')..." value={form.reason} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[80px]" required />
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {searched && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Results</h2>
            <Table columns={columns} data={results} loading={loading} />
            {!loading && results.length === 0 && <p className="mt-4 text-center text-gray-500">No records found for the given query.</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchGuestPage;