// src/features/guest/useGuestForm.js
import { useState, useEffect } from 'react';
import { format, differenceInYears, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { dataURLtoFile } from '../../lib/utils'; 

const getInitialFormState = () => ({
  name: '',
  dob: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
  address: { street: '', city: '', state: '', zipCode: '' },
  nationality: '',
  purpose: '',
  checkIn: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  expectedCheckout: '',
  roomNumber: '',
  idType: '',
  idNumber: '',
  idImageFront: null,
  idImageBack: null,
  livePhoto: null,
  accompanyingGuests: [], 
});

const initialGuestState = {
    name: '', dob: '', age: '', gender: '',
    idType: '', idNumber: '', idImageFront: null, idImageBack: null, livePhoto: null
};

export const useGuestForm = () => {
  const [formState, setFormState] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [captureFor, setCaptureFor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vacantRooms, setVacantRooms] = useState([]);
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacantRooms = async () => {
      setIsRoomsLoading(true);
      try {
        const { data } = await apiClient.get('/rooms/dashboard');
        setVacantRooms(data.data.vacantRooms || []);
      } catch (error) {
        toast.error('Could not fetch vacant rooms list.');
      } finally {
        setIsRoomsLoading(false);
      }
    };
    fetchVacantRooms();
  }, []);

  const setFormValue = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const openWebcam = (type, index = null) => {
    setCaptureFor({ type, index });
    setIsWebcamOpen(true);
  };

  const closeWebcam = () => {
    setIsWebcamOpen(false);
    setCaptureFor(null);
  };

  const handleCapture = (imageSrc) => {
    if (!captureFor) return;
    const { type, index } = captureFor;

    if (index === null) {
      setFormValue(type, imageSrc);
    } else {
     
      const key = type.replace('accompanying_', ''); 
      handleGuestChange(index, key, imageSrc); 
    }

    closeWebcam();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormState((prev) => ({
        ...prev,
        [parentKey]: { ...prev[parentKey], [childKey]: value },
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGuestChange = (index, key, value) => {
    setFormState((prev) => {
      const guests = [...prev.accompanyingGuests];
      guests[index] = { ...guests[index], [key]: value };

      if (key === 'dob' && value) {
        try {
          guests[index].age = differenceInYears(new Date(), parseISO(value)).toString();
        } catch {
          guests[index].age = '';
        }
      }
      return { ...prev, accompanyingGuests: guests };
    });
  };

  const addGuest = () => {
    setFormState((prev) => ({
      ...prev,
      accompanyingGuests: [...prev.accompanyingGuests, initialGuestState],
    }));
  };

  const removeGuest = (index) => {
    setFormState((prev) => ({
      ...prev,
      accompanyingGuests: prev.accompanyingGuests.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const errs = {};
    // Primary guest validation 
    if (!formState.name.trim()) errs.name = 'Full name is required';
    if (!formState.dob) errs.dob = 'Date of Birth is required';
    if (!formState.gender) errs.gender = 'Gender is required';
    if (!formState.phone.trim()) errs.phone = 'Phone number is required';
    if (!formState.email.trim()) errs.email = 'Email is required';
    if (!formState.address.state.trim()) errs['address.state'] = 'State is required';
    if (!formState.address.city.trim()) errs['address.city'] = 'City is required';
    if (!formState.address.zipCode.trim()) errs['address.zipCode'] = 'Zip code is required';
   // if (!formState.address.country.trim()) errs['address.country'] = 'Country is required';
    if (!formState.nationality.trim()) errs.nationality = 'Nationality is required';
    if (!formState.purpose.trim()) errs.purpose = 'Purpose of visit is required';
    if (!formState.checkIn) errs.checkIn = 'Check-in time is required';
    if (!formState.expectedCheckout) errs.expectedCheckout = 'Expected checkout is required';
    if (!formState.roomNumber) errs.roomNumber = 'Please select a vacant room';
    if (!formState.idType) errs.idType = 'ID type is required';
    if (!formState.idNumber.trim()) errs.idNumber = 'ID number is required';
    if (!formState.idImageFront) errs.idImageFront = 'ID proof front is required';
    if (!formState.idImageBack) errs.idImageBack = 'ID proof back is required';
    if (!formState.livePhoto) errs.livePhoto = 'Live photo is required';

    // Validate accompanying guests
    formState.accompanyingGuests.forEach((guest, index) => {
      if (!guest.name.trim()) errs[`accompanying_${index}_name`] = `Guest ${index + 1} name is required`;
      if (!guest.dob) errs[`accompanying_${index}_dob`] = `Guest ${index + 1} DOB is required`;
      
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setFormState(getInitialFormState());
    setErrors({});
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) {
        toast.error('Please fill all required fields correctly.');
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading('Registering guest...');
      const formData = new FormData();

      try {
        // Append primary guest details 
        formData.append('primaryGuestName', formState.name);
        formData.append('primaryGuestDob', formState.dob);
        // formData.append('primaryGuestAge', formState.age); 
        formData.append('primaryGuestGender', formState.gender);
        formData.append('primaryGuestPhone', formState.phone);
        formData.append('primaryGuestEmail', formState.email);
        formData.append('primaryGuestAddressStreet', formState.address.street);
        formData.append('primaryGuestAddressCity', formState.address.city);
        formData.append('primaryGuestAddressState', formState.address.state);
        formData.append('primaryGuestAddressZipCode', formState.address.zipCode);
      //  formData.append('primaryGuestAddressCountry', formState.address.country);
        formData.append('primaryGuestNationality', formState.nationality);
        formData.append('purposeOfVisit', formState.purpose);
        formData.append('checkIn', formState.checkIn); 
        formData.append('expectedCheckout', formState.expectedCheckout);
        formData.append('roomNumber', formState.roomNumber);
        formData.append('idType', formState.idType);
        formData.append('idNumber', formState.idNumber);

        // Append primary guest files 
        if (formState.idImageFront) {
          formData.append('idImageFront', dataURLtoFile(formState.idImageFront, 'idImageFront.jpg')); //
        }
        if (formState.idImageBack) {
          formData.append('idImageBack', dataURLtoFile(formState.idImageBack, 'idImageBack.jpg')); //
        }
        if (formState.livePhoto) {
          formData.append('livePhoto', dataURLtoFile(formState.livePhoto, 'livePhoto.jpg')); //
        }

        // Exclude the file data itself from the JSON
        const guestsForJson = formState.accompanyingGuests.map(g => ({
            name: g.name,
            dob: g.dob,
            age: g.age,
            gender: g.gender,
            idType: g.idType,
            idNumber: g.idNumber,
        }));
        formData.append('accompanyingGuests', JSON.stringify(guestsForJson));

        formState.accompanyingGuests.forEach((guest, index) => {
          if (guest.idImageFront) {
            formData.append(`accompanying_${index}_idImageFront`, dataURLtoFile(guest.idImageFront, `accompanying_${index}_idFront.jpg`)); //
          }
          if (guest.idImageBack) {
            formData.append(`accompanying_${index}_idImageBack`, dataURLtoFile(guest.idImageBack, `accompanying_${index}_idBack.jpg`)); //
          }
          if (guest.livePhoto) {
            formData.append(`accompanying_${index}_livePhoto`, dataURLtoFile(guest.livePhoto, `accompanying_${index}_livePhoto.jpg`)); //
          }
        });

        // API call 
        const response = await apiClient.post('/guests/register', formData, { //
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast.success(response.data.message || 'Guest registered successfully!', { id: toastId });
        resetForm();
        navigate('/hotel/dashboard');

      } catch (apiError) {
        const errorMessage = apiError.response?.data?.message || 'Failed to register guest.';
        toast.error(errorMessage, { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    };

  return {
    formState,
    errors,
    isWebcamOpen,
    handleChange,
    handleGuestChange, 
    handleSubmit,
    openWebcam,
    closeWebcam,
    handleCapture,
    addGuest, 
    removeGuest, 
    isSubmitting,
    vacantRooms,
    isRoomsLoading,
  };
};