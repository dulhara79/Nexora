import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordStrengthMeter = ({ password, isDarkMode }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    
    return strength;
  };

  const strength = calculateStrength(password);
  
  const getStrengthLabel = () => {
    if (strength === 0) return 'None';
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };
  
  const getStrengthColor = () => {
    if (strength === 0) return isDarkMode ? 'bg-gray-600' : 'bg-gray-300';
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Password Strength</span>
        <span className={`text-xs font-medium ${
          strength === 0 ? (isDarkMode ? 'text-gray-400' : 'text-gray-500') :
          strength <= 2 ? 'text-red-500' :
          strength <= 4 ? 'text-yellow-500' :
          'text-green-500'
        }`}>{getStrengthLabel()}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
        <motion.div 
          className={`h-full ${getStrengthColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const PasswordInput = ({ label, name, value, onChange, icon: Icon, placeholder, isDarkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500';
  
  const focusRing = isFocused 
    ? isDarkMode ? 'ring-2 ring-blue-500/30' : 'ring-2 ring-blue-500/20' 
    : '';

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="relative">
        <Icon className={`absolute ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} left-3 top-1/2 -translate-y-1/2`} size={18} />
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:outline-none transition-all duration-300 ${inputClasses} ${focusRing}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {name === 'password' && value && <PasswordStrengthMeter password={value} isDarkMode={isDarkMode} />}
    </div>
  );
};

const ChangePasswordSection = ({ userData, handleInputChange, passwordError, isDarkMode }) => {
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const headerText = isDarkMode ? 'text-white' : 'text-gray-800';
  const subtitleText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const passwordMatch = userData.password && userData.confirmPassword && 
                        userData.password === userData.confirmPassword;

  return (
    <motion.div
      className={`rounded-xl p-6 border shadow-sm ${cardBorder} ${cardBg}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.7)'
      }}
    >
      <div className="mb-6">
        <motion.div 
          className="flex items-center gap-2 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ShieldCheck className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={22} />
          <h2 className={`text-2xl font-bold ${headerText}`}>
            Change Password
          </h2>
        </motion.div>
        <motion.p
          className={`${subtitleText}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Ensure your account stays secure with a strong password
        </motion.p>
      </div>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <PasswordInput
            label="Current Password"
            name="currentPassword"
            value={userData.currentPassword}
            onChange={handleInputChange}
            icon={Lock}
            placeholder="Enter your current password"
            isDarkMode={isDarkMode}
          />
        </motion.div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <PasswordInput
              label="New Password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              icon={Lock}
              placeholder="Enter new password"
              isDarkMode={isDarkMode}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              icon={Lock}
              placeholder="Confirm new password"
              isDarkMode={isDarkMode}
            />
            
            {userData.password && userData.confirmPassword && (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center mt-2"
                >
                  {passwordMatch ? (
                    <div className="flex items-center text-sm text-green-500">
                      <ShieldCheck size={16} className="mr-1" />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-red-500">
                      <AlertTriangle size={16} className="mr-1" />
                      <span>Passwords don't match</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {passwordError && (
          <motion.div
            className="flex items-center p-3 mt-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle size={16} className="flex-shrink-0 mr-2" />
            <span>{passwordError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChangePasswordSection;