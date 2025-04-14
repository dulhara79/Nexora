import React from 'react';

const ProfileStats = ({ profileUser }) => (
  <div className="grid grid-cols-3 gap-4 p-4 mt-6 bg-gray-50 rounded-xl">
    <div className="text-center">
      <span className="block text-2xl font-bold text-blue-600">{profileUser?.posts?.length || 0}</span>
      <span className="text-sm text-gray-600">Posts</span>
    </div>
    <div className="text-center">
      <span className="block text-2xl font-bold text-blue-600">{profileUser?.followers?.length || 0}</span>
      <span className="text-sm text-gray-600">Followers</span>
    </div>
    <div className="text-center">
      <span className="block text-2xl font-bold text-blue-600">{profileUser?.following?.length || 0}</span>
      <span className="text-sm text-gray-600">Following</span>
    </div>
  </div>
);

export default ProfileStats;