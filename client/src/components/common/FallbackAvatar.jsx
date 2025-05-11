// FEED PAGE FORUM AVATAR ANIMATION
// FallbackAvatar.jsx
import React from 'react';

function getInitials(name) {
  if (!name) return '?';
  const words = name.split(' ');
  return words.length > 1 
    ? words[0][0] + words[1][0] 
    : words[0][0];
}

function getColorFromName(name = '') {
  // Generate consistent color based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 60%)`;
}

export default function FallbackAvatar({ src, name, size = 10 }) {
  const hasImage = src && typeof src === 'string';
  const initials = getInitials(name);

  const sizeClasses = {
    8: 'w-8 h-8 text-sm',
    10: 'w-10 h-10 text-base',
    12: 'w-12 h-12 text-lg'
  };

  const sizeClass = sizeClasses[size] || sizeClasses[10];

  return (
    <div className={`relative ${sizeClass} rounded-full overflow-hidden flex items-center justify-center`}>
      {hasImage ? (
        <img src={src} alt={name || 'User'} className="object-cover w-full h-full" />
      ) : (
        <div 
          className={`absolute inset-0 flex items-center justify-center font-bold text-white ${sizeClass}`}
          style={{ backgroundColor: getColorFromName(name) }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}