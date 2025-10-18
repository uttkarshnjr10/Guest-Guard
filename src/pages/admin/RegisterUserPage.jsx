// src/pages/admin/RegisterUserPage.jsx
import Select from 'react-select';
import { useRegisterUser } from '../../features/admin/useRegisterUser';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Sub-component for the success screen
const SuccessDisplay = ({ username, password, onReset }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-2">User Registered Successfully!</h2>
      <p className="text-gray-600 mb-6">Please securely share these credentials with the new user.</p>
      <div className="space-y-4 text-left">
        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
          <span className="font-semibold text-gray-700">Username:</span>
          <div className="flex items-center gap-3">
            <code>{username}</code>
            <FaCopy className="cursor-pointer text-gray-500 hover:text-blue-600" onClick={() => copyToClipboard(username)} />
          </div>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
          <span className="font-semibold text-gray-700">Temp Password:</span>
          <div className="flex items-center gap-3">
            <code>{password}</code>
            <FaCopy className="cursor-pointer text-gray-500 hover:text-blue-600" onClick={() => copyToClipboard(password)} />
          </div>
        </div>
      </div>
      <Button onClick={onReset} className="mt-8 w-full">Register Another User</Button>
    </div>
  );
};

const RegisterUserPage = () => {
  const { userType, formData, policeStations, loading, successData, inquiryData, handleTypeChange, handleChange, handleSelectChange, handleSubmit, resetForm } = useRegisterUser();

  if (successData) {
    return <SuccessDisplay username={successData.username} password={successData.password} onReset={resetForm} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Register New User</h1>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        {/* User Type Switcher */}
        <div className="flex justify-center mb-8 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => handleTypeChange('Hotel')}
            disabled={inquiryData}
            className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${userType === 'Hotel' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'} ${inquiryData ? 'cursor-not-allowed' : ''}`}
          >
            Hotel
          </button>
          <button
            onClick={() => handleTypeChange('Police')}
            disabled={inquiryData}
            className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${userType === 'Police' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'} ${inquiryData ? 'cursor-not-allowed' : ''}`}
          >
            Police
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {userType === 'Hotel' ? (
            <>
              <FormField label="Hotel Name *" name="name" value={formData.name} onChange={handleChange} required />
              <FormField label="Official Address *" name="address" value={formData.address} onChange={handleChange} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="City *" name="city" value={formData.city} onChange={handleChange} required />
                <FormField label="License Number *" name="license" value={formData.license} onChange={handleChange} required />
              </div>
              <FormField label="Contact Email *" name="contact" type="email" value={formData.contact} onChange={handleChange} required />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Station Name *" name="station" value={formData.station} onChange={handleChange} required />
                <FormField label="Jurisdiction *" name="jurisdiction" value={formData.jurisdiction} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Police Station *</label>
                <Select options={policeStations} onChange={handleSelectChange} placeholder="Search and select a station..." required />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField label="City *" name="city" value={formData.city} onChange={handleChange} required />
                 <FormField label="Contact Email *" name="contact" type="email" value={formData.contact} onChange={handleChange} required />
               </div>
            </>
          )}
          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Registering...' : 'Register User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;