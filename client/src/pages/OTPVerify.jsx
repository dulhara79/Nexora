import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

axios.defaults.withCredentials = true;

const OTPVerify = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const email = location.state?.email || "";

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("otp", otp);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login/verify",
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );

      login({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
      });
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      await axios.post("http://localhost:5000/api/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });
      setError("OTP resent successfully");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "backOut" },
    },
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-full max-w-md px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="p-8 border border-white shadow-2xl bg-white/50 backdrop-blur-lg rounded-3xl sm:p-10">
          <div className="mb-10 text-center">
            <motion.h2
              variants={itemVariants}
              className="mb-2 text-4xl font-bold text-transparent text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text"
            >
              Verify OTP
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-2 font-medium text-gray-500"
            >
              Enter the OTP sent to {email}
            </motion.p>
          </div>

          {error && (
            <motion.div
              variants={itemVariants}
              className={`mb-6 text-sm text-center ${
                error.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                One-Time Password (OTP)
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
                  placeholder="Enter 6-digit OTP"
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
                {loading ? "Verifying..." : "Verify OTP"}
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            variants={itemVariants}
            className="mt-6 text-sm text-center text-gray-500"
          >
            Didn’t receive an OTP?{" "}
            <button
              onClick={handleResendOTP}
              className="font-medium text-indigo-600 hover:text-indigo-500"
              disabled={loading || !email}
            >
              Resend OTP
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerify;
