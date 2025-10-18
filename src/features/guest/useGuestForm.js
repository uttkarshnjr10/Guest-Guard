// src/features/guest/useGuestForm.js
import { useState } from 'react';
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
  address: { street: '', city: '', state: '', zipCode: '', country: '' },
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
  guests: {
    adults: [],
    children: [],
  },
});

const initialAdultState = {
    name: '', dob: '', age: '', gender: '',
    idType: '', idNumber: '', idImageFront: null, idImageBack: null, livePhoto: null
};
const initialChildState = {
    name: '', dob: '', age: '', gender: '',
    idType: '', idNumber: '', idImageFront: null, idImageBack: null, livePhoto: null
};


export const useGuestForm = () => {
  const [formState, setFormState] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [captureFor, setCaptureFor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      const guestType = type.startsWith('adult') ? 'adults' : 'children';
      const key = type.replace(/^(adult|child)_/, '');
      handleGuestChange(guestType, index, key, imageSrc);
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

  const handleGuestChange = (guestType, index, key, value) => {
    setFormState((prev) => {
      const guests = [...prev.guests[guestType]];
      guests[index] = { ...guests[index], [key]: value };

      if (key === 'dob' && value) {
        try {
          guests[index].age = differenceInYears(new Date(), parseISO(value)).toString();
        } catch {
          guests[index].age = '';
        }
      }
      return { ...prev, guests: { ...prev.guests, [guestType]: guests } };
    });
  };

  const addGuest = (guestType) => {
    setFormState((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [guestType]: [...prev.guests[guestType], guestType === 'adults' ? initialAdultState : initialChildState],
      },
    }));
  };

  const removeGuest = (guestType, index) => {
    setFormState((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [guestType]: prev.guests[guestType].filter((_, i) => i !== index),
      },
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formState.name.trim()) errs.name = 'Full name is required';
    if (!formState.dob) errs.dob = 'Date of Birth is required';
    if (!formState.gender) errs.gender = 'Gender is required';
    if (!formState.phone.trim()) errs.phone = 'Phone number is required';
    if (!formState.email.trim()) errs.email = 'Email is required';
    if (!formState.address.state.trim()) errs['address.state'] = 'State is required';
    if (!formState.address.city.trim()) errs['address.city'] = 'City is required';
    if (!formState.address.zipCode.trim()) errs['address.zipCode'] = 'Zip code is required';
    if (!formState.address.country.trim()) errs['address.country'] = 'Country is required';
    if (!formState.nationality.trim()) errs.nationality = 'Nationality is required';
    if (!formState.purpose.trim()) errs.purpose = 'Purpose of visit is required';
    if (!formState.checkIn) errs.checkIn = 'Check-in time is required';
    if (!formState.expectedCheckout) errs.expectedCheckout = 'Expected checkout is required';
    if (!formState.roomNumber.trim()) errs.roomNumber = 'Room number is required';
    if (!formState.idType) errs.idType = 'ID type is required';
    if (!formState.idNumber.trim()) errs.idNumber = 'ID number is required';
    if (!formState.idImageFront) errs.idImageFront = 'ID proof front is required';
    if (!formState.idImageBack) errs.idImageBack = 'ID proof back is required';
    if (!formState.livePhoto) errs.livePhoto = 'Live photo is required';
    // Validate accompanying guests if any
    formState.guests.adults.forEach((adult, index) => {
      if (!adult.name.trim()) errs[`adults_${index}_name`] = `Adult ${index + 1} name is required`;
      if (!adult.dob) errs[`adults_${index}_dob`] = `Adult ${index + 1} DOB is required`;
    });
    formState.guests.children.forEach((child, index) => {
      if (!child.name.trim()) errs[`children_${index}_name`] = `Child ${index + 1} name is required`;
      if (!child.dob) errs[`children_${index}_dob`] = `Child ${index + 1} DOB is required`;
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
      formData.append('primaryGuestAge', formState.age);
      formData.append('primaryGuestGender', formState.gender);
      formData.append('primaryGuestPhone', formState.phone);
      formData.append('primaryGuestEmail', formState.email);
      formData.append('primaryGuestAddressStreet', formState.address.street);
      formData.append('primaryGuestAddressCity', formState.address.city);
      formData.append('primaryGuestAddressState', formState.address.state);
      formData.append('primaryGuestAddressZipCode', formState.address.zipCode);
      formData.append('primaryGuestAddressCountry', formState.address.country);
      formData.append('primaryGuestNationality', formState.nationality);
      formData.append('purposeOfVisit', formState.purpose);
      formData.append('checkInTime', formState.checkIn);
      formData.append('expectedCheckout', formState.expectedCheckout);
      formData.append('roomNumber', formState.roomNumber);
      formData.append('idType', formState.idType);
      formData.append('idNumber', formState.idNumber);

      // Append primary guest files
      if (formState.idImageFront) {
        formData.append('idImageFront', dataURLtoFile(formState.idImageFront, 'idImageFront.jpg'));
      }
      if (formState.idImageBack) {
        formData.append('idImageBack', dataURLtoFile(formState.idImageBack, 'idImageBack.jpg'));
      }
      if (formState.livePhoto) {
        formData.append('livePhoto', dataURLtoFile(formState.livePhoto, 'livePhoto.jpg'));
      }

      // Append accompanying guests as a JSON string
      formData.append('accompanyingGuests', JSON.stringify(formState.guests));

      // <-- UPDATED SECTION START -->
      // Append files for accompanying guests
      formState.guests.adults.forEach((adult, index) => {
        if (adult.idImageFront) {
          formData.append(`adult_${index}_idImageFront`, dataURLtoFile(adult.idImageFront, `adult_${index}_idFront.jpg`));
        }
        if (adult.idImageBack) {
          formData.append(`adult_${index}_idImageBack`, dataURLtoFile(adult.idImageBack, `adult_${index}_idBack.jpg`));
        }
        if (adult.livePhoto) {
          formData.append(`adult_${index}_livePhoto`, dataURLtoFile(adult.livePhoto, `adult_${index}_livePhoto.jpg`));
        }
      });

      formState.guests.children.forEach((child, index) => {
        if (child.idImageFront) {
          formData.append(`child_${index}_idImageFront`, dataURLtoFile(child.idImageFront, `child_${index}_idFront.jpg`));
        }
        if (child.idImageBack) {
          formData.append(`child_${index}_idImageBack`, dataURLtoFile(child.idImageBack, `child_${index}_idBack.jpg`));
        }
        if (child.livePhoto) {
          formData.append(`child_${index}_livePhoto`, dataURLtoFile(child.livePhoto, `child_${index}_livePhoto.jpg`));
        }
      });
      // <-- UPDATED SECTION END -->

      const response = await apiClient.post('/guests/register', formData, {
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
  };
};