// src/pages/public/WhyUsPage.jsx
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaDigitalTachograph, FaUsers, FaLock, FaBell, FaFileInvoice, FaInstagram, FaYoutube,FaLinkedin } from 'react-icons/fa'; // Added social icons
import Navbar from '../../components/layout/Navbar'; 

const FeatureCard = ({ icon, title, description }) => {
    // ... FeatureCard component remains the same ...
   return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"> {/* */}
      <div className="text-blue-600 mb-4">{icon}</div> {/* */}
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3> {/* */}
      <p className="text-gray-600 leading-relaxed">{description}</p> {/* */}
    </div>
  );
}; //

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
   <footer className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white text-gray-700 border-t border-indigo-100 py-8 shadow-sm rounded-t-lg">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center mb-3">
          <img src="/logo.png" alt="ApnaManager Logo" className="h-8 w-auto mr-2" />
        </div>
        <div className="flex justify-center space-x-6 mb-4 text-indigo-600">
          <a href="https://www.instagram.com/apnamanger" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800 transition-colors">
            <FaInstagram size={22} />
          </a>
          <a href="https://www.youtube.com/@apnamanager" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800 transition-colors">
            <FaYoutube size={22} />
          </a>
          <a href="https://www.linkedin.com/company/apnamanager/" 
          target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800 transition-colors">
            <FaLinkedin size={22} />
          </a>
        </div>
        <p className="text-sm text-gray-600">&copy; {currentYear} ApnaManager. All rights reserved.</p>
      </div>
    </footer>
  );
};


const WhyUsPage = () => {
  return (
    <div className="font-poppins bg-gray-50"> {/* */}
      {/* --- MODIFIED: Use Navbar component --- */}
      <Navbar isPublic={true} /> {/* Pass isPublic prop */}

      {/* Main Content (Unchanged) */}
      <main className="container mx-auto px-6 py-16"> {/* */}
         {/* ... Heading with logo ... */}
          <div className="text-center max-w-4xl mx-auto"> {/* */}
             <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 flex flex-col sm:flex-row justify-center items-center gap-x-4"> {/* */}
               <span>Why</span>
               <img src="/logo.png" alt="ApnaManager Logo" className="h-12 md:h-16 w-auto inline-block mx-2" />
               <span>is the Right Choice</span>
             </h1>
             <p className="text-lg text-gray-600 mb-12"> {/* */}
               We bridge the gap between hospitality and security, providing a robust platform for modern guest management and legal compliance.
             </p>
          </div>
         {/* ... Feature Cards ... */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* */}
           {/* ... FeatureCard components ... */}
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

      {/* Call to Action Section (Unchanged) */}
      <section className="bg-white py-20"> {/* */}
         {/* ... CTA content ... */}
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

      {/* --- ADDED: Footer component --- */}
      <Footer />

    </div>
  );
};

export default WhyUsPage;