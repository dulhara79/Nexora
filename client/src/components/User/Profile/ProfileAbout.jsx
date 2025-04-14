import React from 'react';

const ProfileAbout = ({ profileUser }) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-800">About</h3>
    <p className="mt-2 text-gray-600">{profileUser?.about || "No bio available"}</p>
  </div>
);

export default ProfileAbout;