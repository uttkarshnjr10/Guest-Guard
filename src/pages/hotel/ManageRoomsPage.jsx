import { useManageRooms } from '../../features/hotel/useManageRooms';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { FaTrash, FaBed } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// We can reuse the StatusPill from GuestListPage
const StatusPill = ({ status }) => {
  const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    'Vacant': 'bg-green-100 text-green-800',
    'Occupied': 'bg-yellow-100 text-yellow-800',
    'Maintenance': 'bg-gray-100 text-gray-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ManageRoomsPage = () => {
  const { rooms, loading, roomNumber, handleInputChange, handleAddRoom, handleDeleteRoom } = useManageRooms();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manage Hotel Rooms</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Room</h2>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <FormField
              label="Room Name / Number *"
              name="roomNumber"
              value={roomNumber}
              onChange={handleInputChange}
              placeholder="e.g., 101, 205-B, King Suite"
              required
            />
            <Button type="submit" className="w-full">
              Add Room
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            Add all your rooms one by one. You can name them "101" or "The Royal Suite".
          </p>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Rooms ({rooms.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : rooms.length === 0 ? (
                <p className="text-gray-500 text-center py-4">You haven't added any rooms yet. Use the form to get started.</p>
            ) : (
              // Actual Room List
              rooms.map(room => (
                <div key={room._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <FaBed className="text-blue-500" />
                    <span className="font-semibold text-gray-800">{room.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={room.status} />
                    <Button 
                      onClick={() => handleDeleteRoom(room._id, room.roomNumber)} 
                      variant="danger" 
                      className="text-xs !p-2"
                      disabled={room.status === 'Occupied'}
                      title={room.status === 'Occupied' ? 'Cannot delete an occupied room' : 'Delete room'}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRoomsPage;