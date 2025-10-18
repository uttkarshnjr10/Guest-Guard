import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Button from './Button'; 

// Helper to display a detail row only if value exists
const DetailRow = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="py-2 border-b border-gray-100 last:border-b-0">
            <span className="font-semibold text-gray-600">{label}:</span>
            <span className="ml-2 text-gray-800">{value}</span>
        </div>
    );
};

const StatusPill = ({ status }) => {
    const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
    const statusClasses = {
        Active: 'bg-green-100 text-green-800',
        Approved: 'bg-green-100 text-green-800',
        Suspended: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status || 'N/A'}</span>;
};

const UserProfileModal = ({ user, onClose }) => {
    if (!user) return null;
    // Access nested details
    const details = user.details || {}; // Use empty object as fallback
    // Determine role based on top-level user.role
    const isHotel = user.role === 'Hotel';
    const isPolice = user.role === 'Police';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center p-5 bg-gray-50 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                       
                        {user.role === 'Hotel' ? 'Hotel Profile' : user.role === 'Police' ? 'Police Profile' : 'User Profile'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="p-6 text-sm">
                    <DetailRow label="Username" value={user.username} />
                    {isHotel && (
                        <>
                            <DetailRow label="Hotel Name" value={details.hotelName} />
                            <DetailRow label="City" value={details.city} />
                            <DetailRow label="Address" value={details.address} />
                            <DetailRow label="License/GST" value={details.license} />
                            <DetailRow label="Contact Email" value={details.contact || user.email} />
                        </>
                    )}
                    {isPolice && (
                        <>
                            <DetailRow label="Station Name" value={details.station} />
                            <DetailRow label="Jurisdiction" value={details.jurisdiction} />
                            <DetailRow label="Registered Station ID" value={details.policeStation} /> {/* Assuming this is the ID */}
                            <DetailRow label="City" value={details.city} />
                            <DetailRow label="Contact Email" value={details.contact || user.email} />
                           
                        </>
                    )}
                    
                    {!details.contact && <DetailRow label="Email" value={user.email} /> }
                    <div className="py-2">
                        <span className="font-semibold text-gray-600">Status:</span>
                        <span className="ml-2"><StatusPill status={user.status} /></span>
                    </div>

                    <DetailRow label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} />
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <Button onClick={onClose} variant="secondary">Close</Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserProfileModal;