import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import ForcePasswordResetModal from '../../components/ui/ForcePasswordResetModal'; // Import the new modal

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState({ show: false, userId: null }); // State for the modal
  const navigate = useNavigate();
  const { login } = useAuth();

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetInfo({ show: false, userId: null }); // Reset modal state

    try {
      // Call the updated login function from AuthContext
      const loginResult = await login(email, password);
      toast.success('Login successful!');

      // Check if password reset is required using the new structure
      if (loginResult && loginResult.needsPasswordReset === true) {
        setResetInfo({ show: true, userId: loginResult._id }); // Use _id from loginResult
        setIsLoading(false); // Stop loading indicator
        return; // Show the modal
      }

      if (loginResult && loginResult.role) {
         switch (loginResult.role) {
           case 'Hotel':
             navigate('/hotel');
             break;
           case 'Police':
             navigate('/police');
             break;
           case 'Regional Admin':
             navigate('/regional-admin');
             break;
           default:
             console.error("Unknown user role:", loginResult.role);
             navigate('/'); // Fallback
         }
      } else if (!loginResult?.needsPasswordReset) { 
        console.error("User data or role missing after login, and password reset not required.");
        navigate('/'); // Fallback
      }
    
    } catch (error) {
      toast.error(error.message || 'Login failed.');
      setIsLoading(false); 
    }
  };
  
  const handleResetSuccess = () => {
    setResetInfo({ show: false, userId: null });
    navigate('/login', { state: { message: "Password updated! Please log in with your new password." } });
  };
  
  const containerVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      <AnimatePresence>
        {resetInfo.show && (
          <ForcePasswordResetModal 
            userId={resetInfo.userId} 
            onSuccess={handleResetSuccess} 
          />
        )}
      </AnimatePresence>

      <div className="font-poppins min-h-screen w-screen bg-[#F8F7FF] flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-blue-200 rounded-full -top-40 -left-40 opacity-50 [filter:blur(150px)] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-200 rounded-full -top-20 -right-40 opacity-50 [filter:blur(150px)] animate-pulse"></div>
        <div className="absolute w-[700px] h-[700px] bg-sky-200 rounded-full -bottom-60 left-1/4 opacity-40 [filter:blur(150px)] animate-pulse" style={{ animationDelay: '4s' }}></div>
    
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 z-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ApnaManager</h2>
            <p className="text-gray-600">Login with Your Provided Credential</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:outline-none focus:border-blue-500 transition-colors" />
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:outline-none focus:border-blue-500 transition-colors" />
              <div className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </motion.div>
            <motion.button variants={itemVariants} type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/40 transition-shadow disabled:opacity-50">
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>
          <motion.button variants={itemVariants} onClick={() => navigate('/')} className="mt-6 text-sm text-gray-600 hover:text-blue-600 w-full text-center">
            ← Back to Home
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
