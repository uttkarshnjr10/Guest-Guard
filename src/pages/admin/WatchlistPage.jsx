import { useWatchlist } from '../../features/admin/useWatchlist';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { FaTrash, FaIdCard, FaPhone } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const WatchlistPage = () => {
  const { items, loading, formState, handleInputChange, handleSubmit, handleDelete } = useWatchlist();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manage Watchlist</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Item to Watchlist</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="ID Number or Phone Number *"
              name="value"
              value={formState.value}
              onChange={handleInputChange}
              placeholder="e.g., 123456789012"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                name="type"
                value={formState.type}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="ID_Number">ID Number (Aadhaar, etc.)</option>
                <option value="Phone_Number">Phone Number</option>
              </select>
            </div>
            <FormField
              label="Reason for Watchlist *"
              name="reason"
              value={formState.reason}
              onChange={handleInputChange}
              placeholder="e.g., Suspect in Case #123"
              required
            />
            <Button type="submit" className="w-full">
              Add to Watchlist
            </Button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Watchlist ({items.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-5 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">The watchlist is empty.</p>
            ) : (
              items.map(item => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.type === 'ID_Number' ? <FaIdCard className="text-red-500" /> : <FaPhone className="text-blue-500" />}
                      <span className="font-semibold text-gray-800">{item.value}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Reason: {item.reason}</p>
                    <p className="text-xs text-gray-400 mt-1">Added by: {item.addedBy?.username} on {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button 
                    onClick={() => handleDelete(item._id, item.value)} 
                    variant="danger" 
                    className="text-xs !p-2"
                    title="Remove from watchlist"
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;