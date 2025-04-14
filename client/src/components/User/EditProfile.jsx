import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit, 
  User, 
  Mail, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Globe,
  Save,
  X,
  Lock,
  ImagePlus
} from 'lucide-react';
import axios from 'axios';

const SocialMediaInput = ({ platform, value, onChange }) => {
  const platformIcons = {
    instagram: <Instagram className="w-5 h-5 text-pink-500" />,
    twitter: <Twitter className="w-5 h-5 text-blue-400" />,
    linkedin: <Linkedin className="w-5 h-5 text-blue-600" />,
    website: <Globe className="w-5 h-5 text-gray-600" />
  };

  return (
    <div className="flex items-center mb-4 space-x-3">
      {platformIcons[platform]}
      <input
        type="text"
        placeholder={`Enter ${platform} URL`}
        value={value || ''} 
        onChange={(e) => onChange(platform, e.target.value)}
        className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
      />
    </div>
  );
};

const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  type = 'profile', 
  placeholderSize = { profile: '150x150', banner: '1200x300' }
}) => {
  const [preview, setPreview] = useState(currentImage);
  const defaultImage = `https://placehold.co/${placeholderSize[type]}`;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPEG or PNG images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image must be smaller than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageChange(file, type);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageClasses = {
    profile: "object-cover w-40 h-40 border-4 border-white rounded-full shadow-lg",
    banner: "object-cover w-full h-64 rounded-xl shadow-lg"
  };

  return (
    <div className="relative group">
      <img 
        src={preview || defaultImage}
        alt={`${type} image`} 
        className={imageClasses[type]}
        onError={(e) => { e.target.src = defaultImage; }}
      />
      <label 
        htmlFor={`${type}-image-upload`} 
        className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 cursor-pointer rounded-xl group-hover:opacity-100"
      >
        <ImagePlus className="w-10 h-10" />
        <input 
          type="file" 
          id={`${type}-image-upload`}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
};

function EditProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    about: '',
    profileImage: null, // Will store URL after upload
    bannerImage: null,  // Will store URL after upload
    password: '',
    confirmPassword: '',
    currentPassword: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      linkedin: '',
      website: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('User ID is required');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          withCredentials: true
        });
        const data = response.data;
        const socialMediaObj = {};
        data.socialMedia?.forEach(link => {
          socialMediaObj[link.platform] = link.url;
        });

        setUserData({
          name: data.name || '',
          username: data.username || '',
          email: data.email || '',
          about: data.about || '',
          profileImage: data.profilePhotoUrl || null,
          bannerImage: data.bannerPhotoUrl || null,
          password: '',
          confirmPassword: '',
          currentPassword: '',
          socialMedia: {
            instagram: socialMediaObj.instagram || '',
            twitter: socialMediaObj.twitter || '',
            linkedin: socialMediaObj.linkedin || '',
            website: socialMediaObj.website || ''
          }
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value || ''
    }));
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError(null);
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setUserData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value || ''
      }
    }));
  };

  const handleImageChange = (file, type) => {
    setUserData(prev => ({
      ...prev,
      [`${type}Image`]: file || null
    }));
  };

  const validatePassword = () => {
    if (userData.password) {
      if (userData.password !== userData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return false;
      }
      if (userData.password.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        return false;
      }
    }
    return true;
  };

  const uploadImageToCloudinary = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('skillType', type === 'profile' ? 'profileImage' : 'bannerImage'); // Adjust as needed

    try {
      const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      return response.data.fileUrl; // Assuming FileMetadata returns fileUrl
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      throw new Error(`Failed to upload ${type} image`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('User ID is required');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      // Upload images to Cloudinary if they are File objects
      let profileImageUrl = userData.profileImage;
      let bannerImageUrl = userData.bannerImage;

      if (userData.profileImage instanceof File) {
        profileImageUrl = await uploadImageToCloudinary(userData.profileImage, 'profile');
      }
      if (userData.bannerImage instanceof File) {
        bannerImageUrl = await uploadImageToCloudinary(userData.bannerImage, 'banner');
      }

      // Prepare data for PUT request (no files, just URLs)
      const updatedUserData = {
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        about: userData.about || '',
        profilePhotoUrl: profileImageUrl || '',
        bannerPhotoUrl: bannerImageUrl || '',
        password: userData.password || undefined,
        currentPassword: userData.currentPassword || undefined,
        socialMedia: Object.entries(userData.socialMedia)
          .filter(([_, value]) => value)
          .map(([platform, url]) => ({ platform, url }))
      };

      console.log('Sending to backend:', updatedUserData);

      const response = await axios.put(`http://localhost:5000/api/users/edit/${userId}`, updatedUserData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      console.log('Profile updated:', response.data);
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">         
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto overflow-hidden bg-white shadow-2xl rounded-3xl"
      >
        <div className="relative p-8 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <h1 className="flex items-center text-3xl font-bold">
            <Edit className="w-8 h-8 mr-4" /> Edit Profile
          </h1>
        </div>

        {loading && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
        )}
        
        {error && (
          <div className="p-8 text-center text-red-500">
            {error}
            <button 
              onClick={() => window.location.reload()}
              className="ml-2 text-blue-500 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Profile Images</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-4 text-lg font-medium text-gray-700">Profile Picture</label>
                  <ImageUpload 
                    currentImage={userData.profileImage} 
                    onImageChange={handleImageChange} 
                    type="profile"
                  />
                </div>
                <div>
                  <label className="block mb-4 text-lg font-medium text-gray-700">Profile Banner</label>
                  <ImageUpload 
                    currentImage={userData.bannerImage} 
                    onImageChange={handleImageChange} 
                    type="banner"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-gray-700">Name</label>
                  <div className="relative">
                    <User className="absolute text-gray-400 left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      value={userData.name || ''} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-gray-700">Username</label>
                  <div className="relative">
                    <User className="absolute text-gray-400 left-3 top-3" />
                    <input
                      type="text"
                      name="username"
                      value={userData.username || ''} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute text-gray-400 left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={userData.email || ''} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">About Me</label>
                <textarea
                  name="about"
                  value={userData.about || ''} 
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Social Media Links</h2>
              <div className="grid gap-4">
                <SocialMediaInput 
                  platform="instagram"
                  value={userData.socialMedia.instagram} 
                  onChange={handleSocialMediaChange}
                />
                <SocialMediaInput 
                  platform="twitter"
                  value={userData.socialMedia.twitter} 
                  onChange={handleSocialMediaChange}
                />
                <SocialMediaInput 
                  platform="linkedin"
                  value={userData.socialMedia.linkedin} 
                  onChange={handleSocialMediaChange}
                />
                <SocialMediaInput 
                  platform="website"
                  value={userData.socialMedia.website} 
                  onChange={handleSocialMediaChange}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-gray-700">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute text-gray-400 left-3 top-3" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={userData.currentPassword || ''} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>
                <div></div>
                <div>
                  <label className="block mb-2 text-gray-700">New Password</label>
                  <div className="relative">
                    <Lock className="absolute text-gray-400 left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      value={userData.password || ''} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 pl-10A border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-gray-700">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute text-gray-400 left-3 top-3" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={userData.confirmPassword || ''} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              {passwordError && (
                <div className="text-sm text-red-500">{passwordError}</div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center px-6 py-2.5 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                disabled={loading}
              >
                <X className="w-5 h-5 mr-2" /> Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                disabled={loading}
              >
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default EditProfile;