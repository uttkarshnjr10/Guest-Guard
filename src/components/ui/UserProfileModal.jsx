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

    // Determine if it's a hotel or police profile based on available fields
    // This logic is now more robust based on your useRegisterUser.js file
    const isHotel = user.name && (user.license || user.address); // Hotels have a 'name'
    const isPolice = user.station && user.jurisdiction; // Police have a 'station'

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
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex justify-between items-center p-5 bg-gray-50 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isHotel ? 'Hotel Profile' : isPolice ? 'Police Profile' : 'User Profile'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="p-6 text-sm">
                  
                    <DetailRow label="Name" value={user.name || user.station} />
                    
                    <DetailRow label="Contact Email" value={user.contact || user.email} />
                    
                    {isHotel && (
                        <>
                            <DetailRow label="Address" value={user.address} />
                            <DetailRow label="City" value={user.city} />
                            <DetailRow label="License/GST" value={user.license} />
                        </>
                    )}
                    
                    {isPolice && (
                        <>
                            
                            <DetailRow label="Registered Station" value={user.policeStation} /> 
                            <DetailRow label="Jurisdiction" value={user.jurisdiction || user.location} />
                     
                            <DetailRow label="City" value={user.city} />
                          
                            <DetailRow label="Service ID" value={user.serviceId} />
                            <DetailRow label="Rank" value={user.rank} />
                        </>
                    )}
                    
                    <div className="py-2">
                        <span className="font-semibold text-gray-600">Status:</span>
                        <span className="ml-2"><StatusPill status={user.status} /></span>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <Button onClick={onClose} variant="secondary">Close</Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserProfileModal;