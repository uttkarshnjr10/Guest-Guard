// src/pages/GuestRegistrationPage.jsx
// src/pages/GuestRegistrationPage.jsx
import GuestRegistrationForm from '../../features/guest/GuestRegistrationForm';

const GuestRegistrationPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        New Guest Registration
      </h1>
      <GuestRegistrationForm />
    </div>
  );
};

export default GuestRegistrationPage;