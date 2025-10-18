// src/pages/police/GuestHistoryPage.jsx
import { useState } from 'react';
import { useGuestHistory } from '../../features/police/useGuestHistory';
import Button from '../../components/ui/Button';
import { FaMapMarkerAlt, FaPhone, FaIdCard, FaBuilding, FaExclamationTriangle, FaCommentDots } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const GuestHistoryPage = () => {
  const { history, loading, error, addRemark } = useGuestHistory();
  const [newRemark, setNewRemark] = useState('');

  const handleAddRemark = (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;
    addRemark(newRemark);
    setNewRemark('');
  };

  if (loading) {
    return <Skeleton count={10} />;
  }
  if (error) {
    return <p className="text-red-600 font-semibold">{error}</p>;
  }
  if (!history) {
    return <p>No history found for this guest.</p>;
  }

  const { primaryGuest, stayHistory, alerts, remarks } = history;
  const { name, phone, address } = primaryGuest.primaryGuest;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <header className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-6">
        <img src={primaryGuest.livePhotoURL} alt="Guest" className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
            <p className="flex items-center gap-2"><FaIdCard /> {primaryGuest.idType}: {primaryGuest.idNumber}</p>
            <p className="flex items-center gap-2"><FaPhone /> {phone}</p>
            <p className="flex items-center gap-2"><FaMapMarkerAlt /> {`${address.street}, ${address.city}`}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stay History */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaBuilding /> Stay History</h2>
          <div className="space-y-4">
            {stayHistory.map(stay => (
              <div key={stay._id} className="border-l-4 border-blue-200 pl-4">
                <p className="font-semibold text-gray-800">{stay.hotel.username}</p>
                <p className="text-sm text-gray-500">{stay.hotel.details.city}</p>
                <p className="text-xs text-gray-500">{`${new Date(stay.stayDetails.checkIn).toLocaleDateString()} - ${new Date(stay.stayDetails.expectedCheckout).toLocaleDateString()}`}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Remarks */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaExclamationTriangle className="text-yellow-500" /> Alerts</h2>
            {alerts.length > 0 ? alerts.map(alert => (
              <div key={alert._id} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p className="font-semibold text-yellow-800">{alert.status}: <span className="font-normal">{alert.reason}</span></p>
                <p className="text-xs text-yellow-700">By: {alert.createdBy.username}</p>
              </div>
            )) : <p className="text-gray-500">No alerts for this guest.</p>}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaCommentDots /> Officer Remarks</h2>
            <form onSubmit={handleAddRemark} className="flex gap-2 mb-4">
              <textarea value={newRemark} onChange={(e) => setNewRemark(e.target.value)} placeholder="Add a new investigative remark..." className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
              <Button type="submit">Add</Button>
            </form>
            <div className="space-y-3">
              {remarks.map(remark => (
                <div key={remark._id} className="bg-gray-50 p-3 rounded-md text-sm">
                  <p className="text-gray-800">{remark.text}</p>
                  <p className="text-xs text-gray-500 mt-1">By {remark.officer.username} on {new Date(remark.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestHistoryPage;