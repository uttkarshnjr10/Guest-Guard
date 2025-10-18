// src/pages/admin/HotelInquiriesPage.jsx
import { useHotelInquiries } from '../../features/admin/useHotelInquiries';
import Button from '../../components/ui/Button';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const InquiryCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
    <div className="flex justify-end gap-4 mt-6">
      <div className="h-10 bg-gray-200 rounded w-24"></div>
      <div className="h-10 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

const HotelInquiriesPage = () => {
  const { inquiries, loading, error, handleApprove, handleReject } = useHotelInquiries();

  if (error) return <p className="text-red-600 font-semibold">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Pending Hotel Inquiries</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InquiryCardSkeleton />
          <InquiryCardSkeleton />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No pending inquiries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{inquiry.hotelName}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Owner:</strong> {inquiry.ownerName}</p>
                  <p className="flex items-center gap-2"><FaEnvelope /> {inquiry.email}</p>
                  <p className="flex items-center gap-2"><FaPhone /> {inquiry.mobileNumber}</p>
                  <p><strong>GST:</strong> {inquiry.gstNumber}</p>
                  <p className="flex items-start gap-2"><FaMapMarkerAlt className="mt-1" /> {`${inquiry.fullAddress}, ${inquiry.district}, ${inquiry.state} - ${inquiry.pinCode}`}</p>
                </div>
                <div className="mt-4 text-sm font-medium">
                  <a href={inquiry.ownerSignature.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mr-4">View Signature</a>
                  <a href={inquiry.hotelStamp.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Stamp</a>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button onClick={() => handleApprove(inquiry._id)} className="text-sm">Approve</Button>
                <Button onClick={() => handleReject(inquiry._id)} variant="danger" className="text-sm">Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelInquiriesPage;