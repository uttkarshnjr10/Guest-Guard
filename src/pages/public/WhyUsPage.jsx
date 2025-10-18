// src/pages/WhyUsPage.jsx
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaDigitalTachograph, FaUsers, FaLock, FaBell, FaFileInvoice } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const WhyUsPage = () => {
  return (
    <div className="font-poppins bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            ApnaManager
          </Link>
          <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-semibold transition-colors">
            Login
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Why <span className="text-blue-600">ApnaManager</span> is the Right Choice
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            We bridge the gap between hospitality and security, providing a robust platform for modern guest management and legal compliance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FaShieldAlt size={40} />}
            title="Enhanced Security"
            description="Real-time guest verification against a centralized database helps prevent unauthorized stays and enhances overall safety for all guests."
          />
          <FeatureCard
            icon={<FaDigitalTachograph size={40} />}
            title="Digital Efficiency"
            description="Replace cumbersome physical ledgers with a secure, searchable digital system. Access guest records instantly from anywhere."
          />
          <FeatureCard
            icon={<FaUsers size={40} />}
            title="Seamless Collaboration"
            description="A dedicated and secure channel for hotels and law enforcement to share critical information instantly and discreetly."
          />
          <FeatureCard
            icon={<FaLock size={40} />}
            title="Data Privacy"
            description="We employ end-to-end encryption and robust security protocols to ensure all guest and hotel data remains confidential and secure."
          />
          <FeatureCard
            icon={<FaBell size={40} />}
            title="Instant Alerts"
            description="Receive immediate notifications for flagged individuals, suspicious activities, or important updates from authorities."
          />
          <FeatureCard
            icon={<FaFileInvoice size={40} />}
            title="Compliance Assured"
            description="Automate record-keeping and reporting to effortlessly comply with local and national regulations for guest registration."
          />
        </div>
      </main>

      {/* Call to Action Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Elevate Your Hotel's Security?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our network of forward-thinking hotels. Registration is quick, easy, and the first step towards a safer, more efficient operation.
          </p>
          <Link
            to="/hotel-registration"
            className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
          >
            Register Your Hotel Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WhyUsPage;