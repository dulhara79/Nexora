import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageUpload = ({
  currentImage,
  onImageChange,
  type = 'profile',
  placeholderSize = { profile: '150x150', banner: '1200x300' },
  isDarkMode
}) => {
  const [preview, setPreview] = useState(currentImage);
  const defaultImage = `https://placehold.co/${placeholderSize[type]}`;
  const [isHovered, setIsHovered] = useState(false);

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
    profile: `object-cover w-40 h-40 border-4 ${isDarkMode ? 'border-gray-700' : 'border-white'} rounded-full shadow-lg`,
    banner: `object-cover w-full h-64 rounded-xl shadow-lg`
  };

  return (
    <motion.div 
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.img
        src={preview || defaultImage}
        alt={`${type} image`}
        className={imageClasses[type]}
        onError={(e) => { e.target.src = defaultImage; }}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.label
        htmlFor={`${type}-image-upload`}
        className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: isHovered ? 1 : 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <ImagePlus className="w-10 h-10" />
          <p className="mt-2 text-sm font-medium">Change {type === 'profile' ? 'Profile Picture' : 'Banner'}</p>
        </motion.div>
        <input
          type="file"
          id={`${type}-image-upload`}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </motion.label>
    </motion.div>
  );
};

export default ImageUpload;