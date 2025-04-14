// src/components/User/VerifyEmailForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const VerifyEmailForm = ({ onSubmit, loading, itemVariants }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    if (otp.trim()) {
      onSubmit(otp); // Pass the OTP value to the parent handler
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div variants={itemVariants}>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Verification Code
        </label>
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-3.5 left-3 peer-focus:text-indigo-500" />
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
            className="w-full pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 bg-white/70 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all peer"
            placeholder="Enter 6-digit code"
            maxLength="6"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full py-3.5 px-4 inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </motion.button>
      </motion.div>
    </form>
  );
};

export default VerifyEmailForm;