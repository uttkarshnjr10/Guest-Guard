// src/pages/public/HotelRegistrationPage.jsx
import { Link } from 'react-router-dom';
import { useHotelInquiryForm } from '../../features/admin/useHotelInquiryForm'; //
import FormField from '../../components/ui/FormField'; //
import Button from '../../components/ui/Button'; //
import Navbar from '../../components/layout/Navbar'; 

const FileInputField = ({ label, name, file, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label> {/* */}
    <input
      type="file"
      name={name}
      onChange={onChange}
      required={required}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" //
    />
    {file && <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>} {/* */}
  </div>
); //

const HotelRegistrationPage = () => {
  const { formData, files, isSubmitting, handleInputChange, handleFileChange, handleSubmit } = useHotelInquiryForm(); //

  return (
    <div className="font-poppins bg-gray-50 min-h-screen"> 
      <Navbar isPublic={true} /> 


      <main className="container mx-auto px-6 py-12"> {/* */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg"> {/* */}
          <h1 className="text-4xl font-bold text-gray-900 text-center">Register Your Hotel</h1> {/* */}
          <p className="text-gray-600 text-center mt-2 mb-8">Submit your details and our team will get in touch with you shortly.</p> {/* */}

          <form onSubmit={handleSubmit} className="space-y-8"> {/* */}
            {/* Basic Information */}
            <fieldset className="space-y-6"> {/* */}
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2> {/* */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* */}
                <FormField label="Hotel Name" name="hotelName" value={formData.hotelName} onChange={handleInputChange} required /> {/* */}
                <FormField label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} required /> {/* */}
                <FormField label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required /> {/* */}
                <FormField label="Hotel / Owner Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required /> {/* */}
                <FormField label="Hotel Mobile Number" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleInputChange} required /> {/* */}
              </div>
            </fieldset>

            {/* Address Details */}
            <fieldset className="space-y-6"> {/* */}
               <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Address Details</h2> {/* */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* */}
                 <FormField label="State" name="state" value={formData.state} onChange={handleInputChange} required /> {/* */}
                 <FormField label="District" name="district" value={formData.district} onChange={handleInputChange} required /> {/* */}
                 <FormField
                    label="Post Office"
                    name="postOffice"
                    value={formData.postOffice}
                    onChange={handleInputChange}
                    required
                  />
                 <FormField
                    label="Local Thana (Police Station)"
                    name="localThana"
                    value={formData.localThana}
                    onChange={handleInputChange}
                    required
                  />
                 <FormField label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleInputChange} required /> {/* */}
                 <FormField label="Full Address" name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required className="md:col-span-2" /> {/* */}
               </div>
            </fieldset>

            {/* Document Uploads */}
            <fieldset className="space-y-6"> {/* */}
               <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Document Uploads</h2> {/* */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* */}
                 <FileInputField label="Shop Owner Signature" name="ownerSignature" file={files.ownerSignature} onChange={handleFileChange} required={true} /> {/* */}
                 <FileInputField label="Hotel Stamp / Shop Mohar" name="hotelStamp" file={files.hotelStamp} onChange={handleFileChange} required={true} /> {/* */}
                 <FileInputField label="Owner Aadhaar Card (Optional)" name="aadhaarCard" file={files.aadhaarCard} onChange={handleFileChange} required={false} /> {/* */}
               </div>
            </fieldset>

            <div className="text-right pt-4"> {/* */}
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto"> {/* */}
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </div>
      </main>
      
    </div>
  );
};

export default HotelRegistrationPage;