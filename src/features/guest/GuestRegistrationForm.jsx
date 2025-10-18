// src/features/guest/GuestRegistrationForm.jsx
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useGuestForm } from './useGuestForm';
import { differenceInYears, parseISO, format } from 'date-fns';
import Button from '../../components/ui/Button';
import FormSection from '../../components/ui/FormSection';
import FormField from '../../components/ui/FormField';
import PhotoUpload from '../../components/ui/PhotoUpload';
import WebcamModal from '../../components/ui/WebcamModal';

const GuestRegistrationForm = () => {
  const {
    formState,
    errors,
    isSubmitting,
    isWebcamOpen,
    handleChange,
    handleGuestChange,
    handleSubmit,
    openWebcam,
    closeWebcam,
    handleCapture,
    addGuest,
    removeGuest,
  } = useGuestForm();

  const handleDobChange = (e, index = null, guestType = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      handleGuestChange(guestType, index, name, value);
    } else {
      handleChange(e);
    }
    if (value) {
      const age = differenceInYears(new Date(), parseISO(value)).toString();
      if (index !== null) {
        handleGuestChange(guestType, index, 'age', age);
      } else {
        handleChange({ target: { name: 'age', value: age } });
      }
    } else {
      if (index !== null) {
        handleGuestChange(guestType, index, 'age', '');
      } else {
        handleChange({ target: { name: 'age', value: '' } });
      }
    }
  };

  const minCheckInDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <>
      {isWebcamOpen && (
        <WebcamModal onCapture={handleCapture} onCancel={closeWebcam} />
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-lg shadow-xl"
      >
        <FormSection title="Main Guest Details">
          <FormField
            label="Full Name *"
            name="name"
            value={formState.name}
            onChange={handleChange}
            error={errors.name}
          />
          <FormField
            label="Date of Birth *"
            name="dob"
            type="date"
            value={formState.dob}
            onChange={handleDobChange}
            error={errors.dob}
          />
          <FormField
            label="Age"
            name="age"
            type="number"
            value={formState.age}
            onChange={handleChange}
            disabled
            className="bg-gray-100"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formState.gender}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
          <FormField
            label="Phone Number *"
            name="phone"
            type="tel"
            value={formState.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <FormField
            label="Email *"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            error={errors.email}
          />
        </FormSection>

        <FormSection title="Address & Nationality">
          <FormField
            label="State *"
            name="address.state"
            value={formState.address.state}
            onChange={handleChange}
            error={errors['address.state']}
          />
          <FormField
            label="City *"
            name="address.city"
            value={formState.address.city}
            onChange={handleChange}
            error={errors['address.city']}
          />
          <FormField
            label="Zip Code *"
            name="address.zipCode"
            value={formState.address.zipCode}
            onChange={handleChange}
            error={errors['address.zipCode']}
          />
          <FormField
            label="Country *"
            name="address.country"
            value={formState.address.country}
            onChange={handleChange}
            error={errors['address.country']}
          />
          <FormField
            label="Nationality *"
            name="nationality"
            value={formState.nationality}
            onChange={handleChange}
            error={errors.nationality}
          />
        </FormSection>

        <FormSection title="Stay Details">
          <FormField
            label="Purpose of Visit *"
            name="purpose"
            value={formState.purpose}
            onChange={handleChange}
            className="md:col-span-2 lg:col-span-3"
            error={errors.purpose}
          />
          <FormField
            label="Check-In Time *"
            name="checkIn"
            type="datetime-local"
            value={formState.checkIn}
            onChange={handleChange}
            min={minCheckInDate}
            error={errors.checkIn}
          />
          <FormField
            label="Expected Checkout *"
            name="expectedCheckout"
            type="datetime-local"
            value={formState.expectedCheckout}
            onChange={handleChange}
            min={formState.checkIn}
            error={errors.expectedCheckout}
          />
          <FormField
            label="Allocated Room Number *"
            name="roomNumber"
            value={formState.roomNumber}
            onChange={handleChange}
            error={errors.roomNumber}
          />
        </FormSection>

        <fieldset className="border border-gray-300 p-6 rounded-lg">
          <legend className="text-lg font-semibold text-gray-800 px-2">ID & Photo Proof</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Proof Type *
              </label>
              <select
                name="idType"
                value={formState.idType}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select ID Type</option>
                <option>Aadhaar</option>
                <option>Passport</option>
                <option>Voter ID</option>
                <option>Driving License</option>
              </select>
              {errors.idType && <p className="text-red-500 text-sm mt-1">{errors.idType}</p>}
            </div>
            <FormField
              label="ID Number *"
              name="idNumber"
              value={formState.idNumber}
              onChange={handleChange}
              error={errors.idNumber}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PhotoUpload label="ID Proof Front *" onCaptureClick={() => openWebcam('idImageFront')} imageSrc={formState.idImageFront} error={errors.idImageFront} />
            <PhotoUpload label="ID Proof Back *" onCaptureClick={() => openWebcam('idImageBack')} imageSrc={formState.idImageBack} error={errors.idImageBack} />
            <PhotoUpload label="Live Photo *" onCaptureClick={() => openWebcam('livePhoto')} imageSrc={formState.livePhoto} error={errors.livePhoto} />
          </div>
        </fieldset>

        {/* Accompanying Adults Section */}
        <fieldset className="border border-gray-300 p-6 rounded-lg space-y-6">
          <legend className="text-lg font-semibold text-gray-800 px-2">Accompanying Adults</legend>
          {formState.guests.adults.map((adult, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative space-y-4">
              <button type="button" onClick={() => removeGuest('adults', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTrash /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField label="Full Name" name="name" value={adult.name} onChange={(e) => handleGuestChange('adults', index, 'name', e.target.value)} error={errors[`adults_${index}_name`]} />
                <FormField label="Date of Birth" name="dob" type="date" value={adult.dob} onChange={(e) => handleDobChange(e, index, 'adults')} error={errors[`adults_${index}_dob`]} />
                <FormField label="Age" name="age" type="number" value={adult.age} disabled className="bg-gray-100" />
                {/* --- NEW FIELDS FOR ADULTS START --- */}
                <FormField label="ID Type" name="idType" value={adult.idType || ''} onChange={(e) => handleGuestChange('adults', index, 'idType', e.target.value)} />
                <FormField label="ID Number" name="idNumber" value={adult.idNumber || ''} onChange={(e) => handleGuestChange('adults', index, 'idNumber', e.target.value)} />
                {/* --- NEW FIELDS FOR ADULTS END --- */}
              </div>
              {/* --- NEW PHOTO UPLOADS FOR ADULTS START --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                <PhotoUpload label="ID Front" onCaptureClick={() => openWebcam('adult_idImageFront', index)} imageSrc={adult.idImageFront} />
                <PhotoUpload label="ID Back" onCaptureClick={() => openWebcam('adult_idImageBack', index)} imageSrc={adult.idImageBack} />
                <PhotoUpload label="Live Photo" onCaptureClick={() => openWebcam('adult_livePhoto', index)} imageSrc={adult.livePhoto} />
              </div>
              {/* --- NEW PHOTO UPLOADS FOR ADULTS END --- */}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={() => addGuest('adults')} className="flex items-center gap-2"><FaPlus /> Add Adult</Button>
        </fieldset>

        {/* Accompanying Children Section */}
        <fieldset className="border border-gray-300 p-6 rounded-lg space-y-6">
          <legend className="text-lg font-semibold text-gray-800 px-2">Accompanying Children</legend>
          {formState.guests.children.map((child, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border relative space-y-4">
              <button type="button" onClick={() => removeGuest('children', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTrash /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="Full Name" name="name" value={child.name} onChange={(e) => handleGuestChange('children', index, 'name', e.target.value)} error={errors[`children_${index}_name`]} />
                <FormField label="Date of Birth" name="dob" type="date" value={child.dob} onChange={(e) => handleDobChange(e, index, 'children')} error={errors[`children_${index}_dob`]} />
                <FormField label="Age" name="age" type="number" value={child.age} disabled className="bg-gray-100" />
              </div>
              {/* --- NEW FIELDS FOR CHILDREN START --- */}
              <div className="space-y-4 pt-4 border-t">
                {parseInt(child.age) >= 10 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="ID Type" name="idType" value={child.idType || ''} onChange={(e) => handleGuestChange('children', index, 'idType', e.target.value)} />
                        <FormField label="ID Number" name="idNumber" value={child.idNumber || ''} onChange={(e) => handleGuestChange('children', index, 'idNumber', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PhotoUpload label="ID Front" onCaptureClick={() => openWebcam('child_idImageFront', index)} imageSrc={child.idImageFront} />
                        <PhotoUpload label="ID Back" onCaptureClick={() => openWebcam('child_idImageBack', index)} imageSrc={child.idImageBack} />
                    </div>
                  </>
                )}
                <PhotoUpload label="Live Photo *" onCaptureClick={() => openWebcam('child_livePhoto', index)} imageSrc={child.livePhoto} />
              </div>
              {/* --- NEW FIELDS FOR CHILDREN END --- */}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={() => addGuest('children')} className="flex items-center gap-2"><FaPlus /> Add Child</Button>
        </fieldset>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Guest'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default GuestRegistrationForm;