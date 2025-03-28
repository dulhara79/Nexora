import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, UserIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [likeSkill, setLikeSkill] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleManualSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("likeSkill", likeSkill);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    console.log("Signup form data entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Signup response:", response.data);
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      console.error("Signup error:", err.response);
      setError(
        typeof err.response?.data === "string"
          ? err.response?.data
          : err.response?.data?.error || "Failed to sign up. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const googleAuthUrl = "http://localhost:5000/oauth2/authorization/google";
      const width = 600;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const authWindow = window.open(
        googleAuthUrl,
        "GoogleSignup",
        `width=${width},height=${height},top=${top},left=${left}`
      );

      const checkWindowClosed = setInterval(async () => {
        if (authWindow.closed) {
          clearInterval(checkWindowClosed);
          try {
            const response = await axios.get("http://localhost:5000/api/auth/check-session", {
              withCredentials: true,
            });
            if (response.data.id) {
              navigate(`/profile/${response.data.id}`);
            }
          } catch (err) {
            setError("Google signup failed. Please try again.");
          }
        }
      }, 500);
    } catch (error) {
      setError("Failed to initiate Google signup");
      console.error("Google signup error:", error);
    }
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.1, duration: 0.3, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "backOut" } },
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-full max-w-xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="p-8 border border-white shadow-2xl bg-white/50 backdrop-blur-lg rounded-3xl sm:p-10">
          <div className="mb-10 text-center">
            <motion.h2
              variants={itemVariants}
              className="mb-2 text-4xl font-bold text-transparent text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text"
            >
              Create Your Account
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-2 font-medium text-gray-500"
            >
              Join us to start your journey
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

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignup}
            disabled={loading}
            className="group w-full flex items-center justify-center gap-3 py-3.5 px-4 mb-8 rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:ring-indigo-200 transition-all duration-200"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="font-medium text-gray-700 transition-colors group-hover:text-indigo-600">
              Sign up with Google
            </span>
          </motion.button>

          <motion.div
            variants={itemVariants}
            className="flex items-center my-8"
          >
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm font-medium text-gray-400">
              or sign up with email
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </motion.div>

          <form onSubmit={handleManualSignup} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-gray-400 absolute top-3.5 left-3 peer-focus:text-indigo-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 bg-white/70 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all peer"
                  placeholder="John Doe"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-3.5 left-3 peer-focus:text-indigo-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 bg-white/70 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all peer"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute top-3.5 left-3 peer-focus:text-indigo-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-11 py-3.5 text-gray-900 placeholder-gray-400 bg-white/70 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all peer"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-3.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute top-3.5 left-3 peer-focus:text-indigo-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-11 py-3.5 text-gray-900 placeholder-gray-400 bg-white/70 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all peer"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-3.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Skill You Like
              </label>
              <input
                type="text"
                required
                value={likeSkill}
                onChange={(e) => setLikeSkill(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3.5 text-gray-900 placeholder-gray-400 bg-white/70 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g., Coding, Design"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Profile Photo (Optional)
              </label>
              <div className="relative">
                <PhotoIcon className="w-5 h-5 text-gray-400 absolute top-3.5 left-3 peer-focus:text-indigo-500" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 text-gray-900 bg-white/70 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all peer"
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
                {loading ? "Signing Up..." : "Sign Up"}
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            variants={itemVariants}
            className="mt-8 text-sm text-center text-gray-500"
          >
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 underline hover:text-indigo-500 underline-offset-4"
            >
              Log in here
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;