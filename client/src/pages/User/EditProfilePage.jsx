import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Moon,
  Sun,
  ChevronUp,
  ChevronDown,
  Loader2,
  Camera,
  AlertTriangle,
  Check,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import ProfileImagesSection from "../../components/User/Edit/ProfileImagesSection";
import PersonalInfoSection from "../../components/User/Edit/PersonalInfoSection";
import SocialMediaSection from "../../components/User/Edit/SocialMediaSection";
import ChangePasswordSection from "../../components/User/Edit/ChangePasswordSection";
import FormActions from "../../components/User/Edit/FormActions";
import Header from "../../components/common/NewPageHeader";

const sectionVariants = {
  closed: { opacity: 0, height: 0, overflow: "hidden" },
  open: { opacity: 1, height: "auto", overflow: "visible" },
  transition: { duration: 0.3 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EditProfile = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState(null);
  const [activeSections, setActiveSections] = useState({
    profile: true,
    personal: true,
    social: true,
    password: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    about: "",
    profileImage: null,
    bannerImage: null,
    currentPassword: "",
    password: "",
    confirmPassword: "",
    socialMedia: {
      instagram: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
  });

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const hasDataChanged =
        userData.name !== originalData.name ||
        userData.username !== originalData.username ||
        userData.email !== originalData.email ||
        userData.about !== originalData.about ||
        userData.profileImage !== originalData.profileImage ||
        userData.bannerImage !== originalData.bannerImage ||
        userData.currentPassword !== originalData.currentPassword ||
        userData.password !== originalData.password ||
        userData.confirmPassword !== originalData.confirmPassword ||
        JSON.stringify(userData.socialMedia) !==
          JSON.stringify(originalData.socialMedia);

      setHasChanges(hasDataChanged);
    }
  }, [userData, originalData]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) {
        setError("User ID or authentication token is missing");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const data = response.data.user;
        const socialMediaObj = {};
        data.socialMedia?.forEach((link) => {
          socialMediaObj[link.platform] = link.url;
        });

        const formattedData = {
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          about: data.about || "",
          profileImage: data.profilePhotoUrl || null,
          bannerImage: data.bannerPhotoUrl || null,
          currentPassword: "",
          password: "",
          confirmPassword: "",
          socialMedia: {
            instagram: socialMediaObj.instagram || "",
            twitter: socialMediaObj.twitter || "",
            linkedin: socialMediaObj.linkedin || "",
            website: socialMediaObj.website || "",
          },
        };

        setUserData(formattedData);
        setOriginalData(formattedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.response?.data?.error || "Failed to fetch user data");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token, navigate]);

  // Theme handling
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
  }, []);

  const handleSectionToggle = (section) => {
    setActiveSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setUserData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleImageChange = (file, type) => {
    setUserData((prev) => ({
      ...prev,
      [type === "profile" ? "profileImage" : "bannerImage"]: file,
    }));
  };

  const uploadImageToCloudinary = async (file, type, userId, token) => {
    try {
      const formData = new FormData();
      formData.append(
        type === "profile" ? "profileImage" : "bannerImage",
        file
      );

      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status !== 200 || !response.data.message) {
        throw new Error("Failed to upload image to backend");
      }

      // Fetch updated user data to get the new image URL
      const userResponse = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const imageUrl =
        type === "profile"
          ? userResponse.data.user.profilePhotoUrl
          : userResponse.data.user.bannerPhotoUrl;

      if (!imageUrl) {
        throw new Error(`No ${type} image URL returned`);
      }

      return imageUrl;
    } catch (error) {
      throw new Error(`Failed to upload ${type} image: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    if (!userId || !token) {
      setError("User ID or authentication token is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setPasswordError(null);

    try {
      // Prepare user data for update
      const socialMediaLinks = Object.entries(userData.socialMedia)
        .filter(([_, url]) => url)
        .map(([platform, url]) => ({ platform, url }));

      const updateData = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        about: userData.about,
        socialMedia: JSON.stringify(socialMediaLinks),
      };

      if (
        userData.currentPassword &&
        userData.password &&
        userData.confirmPassword
      ) {
        if (userData.password !== userData.confirmPassword) {
          setPasswordError("New passwords do not match");
          setLoading(false);
          return;
        }
        updateData.currentPassword = userData.currentPassword;
        updateData.password = userData.password;
      }

      // Update user profile
      await axios.put(`http://localhost:5000/api/users/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Handle image uploads
      let updatedProfileImage = userData.profileImage;
      let updatedBannerImage = userData.bannerImage;

      if (userData.profileImage instanceof File) {
        updatedProfileImage = await uploadImageToCloudinary(
          userData.profileImage,
          "profile",
          userId,
          token
        );
      }

      if (userData.bannerImage instanceof File) {
        updatedBannerImage = await uploadImageToCloudinary(
          userData.bannerImage,
          "banner",
          userId,
          token
        );
      }

      // Update local state with new image URLs
      setUserData((prev) => ({
        ...prev,
        profileImage: updatedProfileImage,
        bannerImage: updatedBannerImage,
      }));

      setSaveSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        setSaveSuccess(false);
        navigate(`/profile/${userId}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.error ||
          `Failed to update profile: ${error.message}`
      );
      toast.error(
        error.response?.data?.error ||
          `Failed to update profile: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Edit Profile" isDarkMode={isDarkMode} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="w-full max-w-3xl">
          <motion.div
            className={`relative mx-auto rounded-3xl shadow-xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 sm:p-8`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              </div>
            ) : error ? (
              <motion.div
                className="p-4 text-red-600 bg-red-100 border border-red-200 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle size={16} className="inline-block mr-2" />
                {error.includes("No profile image URL returned") ||
                error.includes("No banner image URL returned")
                  ? "Failed to upload image. Please ensure the file is a valid JPEG/PNG and under 5MB."
                  : error}
              </motion.div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                <LayoutGroup>
                  <div className="space-y-6">
                    {/* Profile Images Section */}
                    <motion.div
                      className={`rounded-xl overflow-hidden border ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } transition-all duration-300`}
                      variants={cardVariants}
                      layout
                    >
                      <motion.div
                        className={`p-4 flex items-center justify-between cursor-pointer ${
                          isDarkMode ? "bg-gray-750" : "bg-gray-50"
                        }`}
                        onClick={() => handleSectionToggle("profile")}
                        whileHover={{
                          backgroundColor: isDarkMode
                            ? "rgba(55, 65, 81, 0.5)"
                            : "rgba(243, 244, 246, 0.7)",
                        }}
                        layout
                      >
                        <h2 className="flex items-center text-xl font-bold">
                          <Camera
                            className={`w-5 h-5 mr-2 ${
                              isDarkMode ? "text-indigo-400" : "text-indigo-500"
                            }`}
                          />
                          Profile Images
                        </h2>
                        <motion.div
                          animate={{
                            rotate: activeSections.profile ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {activeSections.profile ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </motion.div>
                      </motion.div>

                      <AnimatePresence>
                        {activeSections.profile && (
                          <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sectionVariants}
                            layout
                          >
                            <div className="p-6">
                              <ProfileImagesSection
                                userData={userData}
                                handleImageChange={handleImageChange}
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Personal Info Section */}
                    <motion.div
                      className={`rounded-xl overflow-hidden border ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } transition-all duration-300`}
                      variants={cardVariants}
                      layout
                    >
                      <motion.div
                        className={`p-4 flex items-center justify-between cursor-pointer ${
                          isDarkMode ? "bg-gray-750" : "bg-gray-50"
                        }`}
                        onClick={() => handleSectionToggle("personal")}
                        whileHover={{
                          backgroundColor: isDarkMode
                            ? "rgba(55, 65, 81, 0.5)"
                            : "rgba(243, 244, 246, 0.7)",
                        }}
                        layout
                      >
                        <h2 className="flex items-center text-xl font-bold">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`w-5 h-5 mr-2 ${
                              isDarkMode ? "text-indigo-400" : "text-indigo-500"
                            }`}
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          Personal Information
                        </h2>
                        <motion.div
                          animate={{
                            rotate: activeSections.personal ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {activeSections.personal ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </motion.div>
                      </motion.div>

                      <AnimatePresence>
                        {activeSections.personal && (
                          <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sectionVariants}
                            layout
                          >
                            <div className="p-6">
                              <PersonalInfoSection
                                userData={userData}
                                handleInputChange={handleInputChange}
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Social Media Section */}
                    <motion.div
                      className={`rounded-xl overflow-hidden border ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } transition-all duration-300`}
                      variants={cardVariants}
                      layout
                    >
                      <motion.div
                        className={`p-4 flex items-center justify-between cursor-pointer ${
                          isDarkMode ? "bg-gray-750" : "bg-gray-50"
                        }`}
                        onClick={() => handleSectionToggle("social")}
                        whileHover={{
                          backgroundColor: isDarkMode
                            ? "rgba(55, 65, 81, 0.5)"
                            : "rgba(243, 244, 246, 0.7)",
                        }}
                        layout
                      >
                        <h2 className="flex items-center text-xl font-bold">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`w-5 h-5 mr-2 ${
                              isDarkMode ? "text-indigo-400" : "text-indigo-500"
                            }`}
                          >
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                            <line x1="6" y1="1" x2="6" y2="4"></line>
                            <line x1="10" y1="1" x2="10" y2="4"></line>
                            <line x1="14" y1="1" x2="14" y2="4"></line>
                          </svg>
                          Social Media Links
                        </h2>
                        <motion.div
                          animate={{ rotate: activeSections.social ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {activeSections.social ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </motion.div>
                      </motion.div>

                      <AnimatePresence>
                        {activeSections.social && (
                          <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sectionVariants}
                            layout
                          >
                            <div className="p-6">
                              <SocialMediaSection
                                userData={userData}
                                handleSocialMediaChange={
                                  handleSocialMediaChange
                                }
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Change Password Section */}
                    <motion.div
                      className={`rounded-xl overflow-hidden border ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } transition-all duration-300`}
                      variants={cardVariants}
                      layout
                    >
                      <motion.div
                        className={`p-4 flex items-center justify-between cursor-pointer ${
                          isDarkMode ? "bg-gray-750" : "bg-gray-50"
                        }`}
                        onClick={() => handleSectionToggle("password")}
                        whileHover={{
                          backgroundColor: isDarkMode
                            ? "rgba(55, 65, 81, 0.5)"
                            : "rgba(243, 244, 246, 0.7)",
                        }}
                        layout
                      >
                        <h2 className="flex items-center text-xl font-bold">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`w-5 h-5 mr-2 ${
                              isDarkMode ? "text-indigo-400" : "text-indigo-500"
                            }`}
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          Security & Password
                        </h2>
                        <motion.div
                          animate={{
                            rotate: activeSections.password ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {activeSections.password ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </motion.div>
                      </motion.div>

                      <AnimatePresence>
                        {activeSections.password && (
                          <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sectionVariants}
                            layout
                          >
                            <div className="p-6">
                              <ChangePasswordSection
                                userData={userData}
                                handleInputChange={handleInputChange}
                                passwordError={passwordError}
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Form Action Buttons */}
                    <motion.div variants={cardVariants} className="px-2">
                      <FormActions
                        loading={loading}
                        navigate={navigate}
                        isDarkMode={isDarkMode}
                        hasChanges={hasChanges}
                        onSave={handleSubmit}
                      />
                    </motion.div>
                  </div>
                </LayoutGroup>
              </form>
            )}

            {/* Success overlay */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  className="absolute inset-0 z-10 flex items-center justify-center bg-indigo-600 bg-opacity-90 rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      className="flex items-center justify-center w-20 h-20 mb-4 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      <Check size={40} className="text-indigo-600" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white">
                      Profile Updated!
                    </h2>
                    <p className="mt-2 text-indigo-100">
                      Redirecting to your profile...
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default EditProfile;
