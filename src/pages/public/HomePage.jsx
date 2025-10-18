// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { FaArrowRight, FaUserPlus } from 'react-icons/fa'; // Import icons
import signupAnimation from '../Signup Flow.json';

const HomePage = () => {
  // Animation variants for the title container
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Each word will appear 0.1s after the previous one
        delayChildren: 0.5, // Start the animation after a 0.5s delay
      },
    },
  };

  // Animation variants for each word in the title
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const titleText = "Welcome to ApnaManager a Centralized Data Management System";

  return (
    <div className="font-poppins bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-gray-800 overflow-hidden h-screen w-screen flex flex-col relative">
      {/* Why Us Button */}
      <div className="absolute top-5 right-10 z-20">
        <Link
          to="/why-us"
          className="bg-gradient-to-r from-indigo-100 to-indigo-300 text-indigo-800 px-8 py-3 rounded-full font-semibold border border-indigo-300 shadow-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-300 hover:to-indigo-500 hover:text-white hover:-translate-y-0.5 hover:scale-105"
        >
          Why Us
        </Link>
      </div>

      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 opacity-50 [filter:blur(120px)]">
        <div className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full top-[5%] left-[10%] animate-float"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-400/20 rounded-full bottom-[10%] right-[15%] animate-float-slow [animation-delay:-5s]"></div>
      </div>

      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 grid md:grid-cols-2 items-center max-w-6xl mx-auto h-full w-full p-4"
      >
        {/* Text Content */}
        <div className="flex flex-col text-center md:text-left items-center md:items-start">
          <motion.h1
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl font-bold leading-tight text-gray-800 mb-4"
          >
            {/* Mapping over words to animate them individually */}
            {titleText.split(' ').map((word, index) => (
              <motion.span variants={wordVariants} key={index} className="inline-block mr-3">
                {word === 'ApnaManager' ? (
                  <>
                    <br />
                    <span className="font-black text-[1.1em] bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent [text-shadow:0_2px_4px_rgba(0,0,0,0.1)]">
                      {word}
                    </span>
                    <br />
                  </>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }} // Increased delay
            className="text-lg leading-relaxed max-w-md text-gray-600 mb-8"
          >
            We provide a unified platform for hotels and law enforcement to ensure guest safety through seamless digital verification and real-time data sharing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }} // Increased delay
            className="flex flex-col sm:flex-row gap-5 mt-4 items-center"
          >
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95"
            >
              Get Started
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/hotel-registration"
              className="group inline-flex items-center justify-center gap-3 bg-transparent text-blue-600 px-8 py-4 rounded-full font-semibold text-lg border-2 border-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white hover:-translate-y-1 active:scale-95"
            >
              Join Us
              <FaUserPlus className="transition-transform duration-300 group-hover:scale-110" />
            </Link>
          </motion.div>
        </div>

        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden md:flex items-center justify-center row-start-1 md:row-auto"
        >
          <Lottie animationData={signupAnimation} loop={true} className="max-w-md" />
        </motion.div>
      </motion.header>
    </div>
  );
};

export default HomePage;