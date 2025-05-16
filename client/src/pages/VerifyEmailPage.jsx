import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import VerifyEmailForm from "../components/User/VerifyEmailForm";

axios.defaults.withCredentials = true;

const VerifyEmailPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleVerifyEmail = async (otp) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${encodeURIComponent(email)}/verification`,
        { code: otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Verification response:", response.data);
      setSuccess(response.data.message || "Email verified successfully!");
      setTimeout(() => navigate("/feed"), 2000);
    } catch (err) {
      console.error("OTP verification error:", err.response?.data, err.message);
      setError(
        err.response?.data?.error ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${encodeURIComponent(email)}/resend`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(response.data.message || "Verification code resent successfully!");
    } catch (err) {
      console.error("Resend code error:", err.response?.data, err.message);
      setError(
        err.response?.data?.error ||
          "Failed to resend verification code. Please try again."
      );
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
              Verify Your Email
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-2 font-medium text-gray-500"
            >
              Enter the code sent to {email || "your email"}
            </motion.p>
          </div>

          {error && (
            <motion.div
              variants={itemVariants}
              className="mb-6 text-sm text-center text-red-600"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              variants={itemVariants}
              className="mb-6 text-sm text-center text-green-600"
            >
              {success}
            </motion.div>
          )}

          <VerifyEmailForm
            onSubmit={handleVerifyEmail}
            loading={loading}
            itemVariants={itemVariants}
          />

          <motion.div
            variants={itemVariants}
            className="mt-6 text-sm text-center text-gray-500"
          >
            Didn’t receive a code?{" "}
            <button
              onClick={handleResendCode}
              className="font-medium text-indigo-600 hover:text-indigo-500"
              disabled={loading || !email}
            >
              Resend Code
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;