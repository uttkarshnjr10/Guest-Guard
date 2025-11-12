import { Link } from 'react-router-dom';
import Select from 'react-select'; 
import { useAnalytics } from '../../features/police/useAnalytics';
import FlagGuestModal from '../../features/police/FlagGuestModal';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField'; 
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const GuestResultCard = ({ guest, onFlagClick }) => (
  <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4">
    <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden mx-auto sm:mx-0">
      <img src={guest.livePhotoURL} alt={guest.primaryGuest.name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-xl font-bold text-gray-800">{guest.primaryGuest.name}</h3>
      <p className="text-sm text-gray-600">ID: <span className="font-medium text-gray-700">{guest.idNumber}</span></p>
      <p className="text-sm text-gray-600">Hotel: <span className="font-medium text-gray-700">{guest.hotel.hotelName}</span></p>
      <p className="text-sm text-gray-600">City: <span className="font-medium text-gray-700">{guest.hotel.city}</span></p>
      <p className="text-sm text-gray-600">Check-In: <span className="font-medium text-gray-700">{new Date(guest.stayDetails.checkIn).toLocaleDateString()}</span></p>
    </div>
    <div className="flex flex-row sm:flex-col justify-center sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-4">
      <Button onClick={() => onFlagClick(guest)} variant="danger" className="text-sm py-2 px-3 w-full">Flag</Button>
      <Link to={`/police/guest/${guest._id}`} className="w-full">
        <Button variant="secondary" className="text-sm py-2 px-3 w-full">History</Button>
      </Link>
    </div>
  </div>
);

const AnalyticsPage = () => {
  const { form, hotels, results, loading, searched, flaggingGuest, setFlaggingGuest, handleFormChange, handleSelectChange, handleSearch, handleFlagSubmit } = useAnalytics();

  const SearchSkeleton = () => (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4">
      <Skeleton circle={false} width={112} height={112} className="rounded-lg mx-auto sm:mx-0" />
      <div className="flex-1 text-center sm:text-left"><Skeleton width="60%" height={28} /><Skeleton width="80%" /><Skeleton width="70%" /></div>
      <div className="flex flex-row sm:flex-col gap-2 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-24"><Skeleton height={38} /><Skeleton height={38} /></div>
    </div>
  );

  return (
    <>
      {flaggingGuest && (
        <FlagGuestModal guest={flaggingGuest} onClose={() => setFlaggingGuest(null)} onSubmit={handleFlagSubmit} />
      )}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Guest Analytics & Search</h1>
        
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Hotel</label>
              <Select
                name="hotel"
                options={hotels}
                onChange={handleSelectChange}
                isClearable
                placeholder="Select a specific hotel..."
                className="mt-1"
                isDisabled={!!form.city || !!form.state} 
              />
            </div>
            <FormField
              label="Filter by Purpose of Visit"
              name="purposeOfVisit"
              value={form.purposeOfVisit}
              onChange={handleFormChange}
              placeholder="e.g., Business, Tourism"
            />
          </div>
          <div className="text-center text-sm font-medium text-gray-500 my-2">OR</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Filter by City"
              name="city"
              value={form.city}
              onChange={handleFormChange}
              placeholder="e.g., Patna"
              disabled={!!form.hotel} // Disable if hotel is selected
            />
            <FormField
              label="Filter by State"
              name="state"
              value={form.state}
              onChange={handleFormChange}
              placeholder="e.g., Bihar"
              disabled={!!form.hotel} // Disable if hotel is selected
            />
          </div>
          <hr/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date From"
              name="dateFrom"
              type="date"
              value={form.dateFrom}
              onChange={handleFormChange}
            />
            <FormField
              label="Date To"
              name="dateTo"
              type="date"
              value={form.dateTo}
              onChange={handleFormChange}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {searched && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Results ({results.length})</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><SearchSkeleton /><SearchSkeleton /></div>
            ) : results.length === 0 ? (
              <p className="mt-4 text-center text-gray-500">No records found for this query.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(guest => (
                  <GuestResultCard key={guest._id} guest={guest} onFlagClick={setFlaggingGuest} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AnalyticsPage;