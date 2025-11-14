// src/pages/police/SearchGuestPage.jsx
import { Link } from 'react-router-dom';
import { useSearchGuest } from '../../features/police/useSearchGuest';
import FlagGuestModal from '../../features/police/FlagGuestModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const GuestResultCard = ({ guest, onFlagClick }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4">
      {/* Guest Photo */}
      <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden mx-auto sm:mx-0">
        <img
          src={guest.livePhotoURL}
          alt={guest.primaryGuest?.name || 'Guest'} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Guest Details */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold text-gray-800">{guest.primaryGuest?.name || 'Unnamed Guest'}</h3> {/* <-- FIX */}
        <p className="text-sm text-gray-600">
          {guest.idType}: <span className="font-medium text-gray-700">{guest.idNumber}</span>
        </p>
        <p className="text-sm text-gray-600">
          Phone: <span className="font-medium text-gray-700">{guest.primaryGuest?.phone || 'N/A'}</span> {/* <-- FIX */}
        </p>
        <p className="text-sm text-gray-600">
          Last Hotel: <span className="font-medium text-gray-700">{guest.hotel?.hotelName || guest.hotel?.username || 'Hotel Not Found'}</span> {/* <-- THE MAIN FIX */}
        </p>
        <p className="text-sm text-gray-600">
          Check-In: <span className="font-medium text-gray-700">{new Date(guest.stayDetails.checkIn).toLocaleDateString()}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row sm:flex-col justify-center sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-4">
        <Button 
          onClick={() => onFlagClick(guest)} 
          variant="danger" 
          className="text-sm py-2 px-3 w-full"
        >
          Flag
        </Button>
        <Link to={`/police/guest/${guest._id}`} className="w-full">
          <Button variant="secondary" className="text-sm py-2 px-3 w-full">
            History
          </Button>
        </Link>
      </div>
    </div>
  );
};

const SearchGuestPage = () => {
  const { form, results, loading, searched, flaggingGuest, setFlaggingGuest, handleFormChange, handleSearch, handleFlagSubmit } = useSearchGuest();

  const SearchSkeleton = () => (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4">
      <Skeleton circle={false} width={112} height={112} className="rounded-lg mx-auto sm:mx-0" />
      <div className="flex-1 text-center sm:text-left">
        <Skeleton width="60%" height={28} />
        <Skeleton width="80%" />
        <Skeleton width="70%" />
      </div>
      <div className="flex flex-row sm:flex-col gap-2 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-24">
        <Skeleton height={38} />
        <Skeleton height={38} />
      </div>
    </div>
  );

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
            <select 
              name="searchBy" 
              value={form.searchBy} 
              onChange={handleFormChange} 
              className="w-full sm:w-auto mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="name">Name</option>
              <option value="phone">Phone</option>
              <option value="id">ID Number</option>
            </select>
            <Input 
              type="text" 
              name="query" 
              placeholder={`Enter guest ${form.searchBy}...`} 
              value={form.query} 
              onChange={handleFormChange} 
              className="flex-grow" 
              autoFocus 
            />
          </div>
          <textarea 
            name="reason" 
            placeholder="Reason for search (e.g., 'Active investigation case #123')..." 
            value={form.reason} 
            onChange={handleFormChange} 
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[80px]" 
            required 
          />
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {searched && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Results</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchSkeleton />
                <SearchSkeleton />
              </div>
            ) : results.length === 0 ? (
              <p className="mt-4 text-center text-gray-500">No records found for the given query.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(guest => (
                  <GuestResultCard 
                    key={guest._id} 
                    guest={guest} 
                    onFlagClick={setFlaggingGuest} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default SearchGuestPage;